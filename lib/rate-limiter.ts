/**
 * Rate Limiting Middleware
 * In-memory rate limiter with configurable windows and limits
 */

import { NextRequest, NextResponse } from 'next/server';
import { config } from './config';
import { logger } from './logger';

const log = logger.scope('RateLimiter');

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private store = new Map<string, RateLimitRecord>();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // Cleanup expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  private getKey(identifier: string): string {
    return `rate_limit:${identifier}`;
  }

  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;
    
    this.store.forEach((record, key) => {
      if (record.resetAt < now) {
        this.store.delete(key);
        cleaned++;
      }
    });

    if (cleaned > 0) {
      log.debug(`Cleaned ${cleaned} expired rate limit entries`);
    }
  }

  check(identifier: string): { allowed: boolean; limit: number; remaining: number; resetAt: number } {
    const key = this.getKey(identifier);
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || record.resetAt < now) {
      // New window
      const newRecord: RateLimitRecord = {
        count: 1,
        resetAt: now + this.windowMs,
      };
      this.store.set(key, newRecord);

      return {
        allowed: true,
        limit: this.maxRequests,
        remaining: this.maxRequests - 1,
        resetAt: newRecord.resetAt,
      };
    }

    // Within window
    if (record.count >= this.maxRequests) {
      return {
        allowed: false,
        limit: this.maxRequests,
        remaining: 0,
        resetAt: record.resetAt,
      };
    }

    record.count++;
    this.store.set(key, record);

    return {
      allowed: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - record.count,
      resetAt: record.resetAt,
    };
  }

  reset(identifier: string): void {
    const key = this.getKey(identifier);
    this.store.delete(key);
  }
}

// Create limiter instances
export const generalLimiter = new RateLimiter(
  config.get('RATE_LIMIT_WINDOW_MS'),
  config.get('RATE_LIMIT_MAX_REQUESTS')
);

export const aiLimiter = new RateLimiter(
  config.get('RATE_LIMIT_WINDOW_MS'),
  config.get('AI_RATE_LIMIT_MAX_REQUESTS')
);

/**
 * Get client identifier from request (IP or fallback)
 */
export function getClientIdentifier(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0].trim() || realIp || 'unknown';
  return ip;
}

/**
 * Rate limit middleware wrapper
 */
export function withRateLimit(
  limiter: RateLimiter,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const identifier = getClientIdentifier(req);
    const result = limiter.check(identifier);

    // Add rate limit headers
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', result.limit.toString());
    headers.set('X-RateLimit-Remaining', result.remaining.toString());
    headers.set('X-RateLimit-Reset', new Date(result.resetAt).toISOString());

    if (!result.allowed) {
      log.warn('Rate limit exceeded', { identifier, path: req.nextUrl.pathname });
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers,
        }
      );
    }

    const response = await handler(req);
    
    // Add rate limit headers to successful response
    headers.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  };
}

export type { RateLimitRecord };
