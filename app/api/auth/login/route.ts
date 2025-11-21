/**
 * Login API Route
 * Production-ready authentication endpoint with rate limiting and security
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { signJwt, setAuthCookie } from '@/lib/auth-jwt';
import { withRateLimit, generalLimiter } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';
import { config } from '@/lib/config';

const log = logger.scope('AuthLogin');

const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

async function handleLogin(req: NextRequest): Promise<NextResponse> {
  try {
    // Check if database is available
    if (!prisma) {
      log.error('Database not available');
      return NextResponse.json(
        { error: 'Service unavailable', message: 'Authentication service is not configured' },
        { status: 503 }
      );
    }

    if (!config.hasAuth()) {
      log.error('Auth not configured');
      return NextResponse.json(
        { error: 'Service unavailable', message: 'Authentication is not configured' },
        { status: 503 }
      );
    }

    // Parse and validate request
    let body;
    try {
      body = await req.json();
    } catch (error) {
      log.warn('Invalid JSON in request');
      return NextResponse.json(
        { error: 'Invalid request', message: 'Request body must be valid JSON' },
        { status: 400 }
      );
    }

    const validation = LoginSchema.safeParse(body);
    if (!validation.success) {
      log.debug('Validation failed', { errors: validation.error.flatten() });
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    log.info('Login attempt', { email });

    // Find user
    const userRecord = await prisma.user.findUnique({ where: { email } });
    if (!userRecord) {
      log.warn('Login failed: user not found', { email });
      // Use generic message to prevent email enumeration
      return NextResponse.json(
        { error: 'Invalid credentials', message: 'Email or password is incorrect' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, userRecord.passwordHash);
    if (!isValid) {
      log.warn('Login failed: invalid password', { email });
      return NextResponse.json(
        { error: 'Invalid credentials', message: 'Email or password is incorrect' },
        { status: 401 }
      );
    }

    // Update last login
    await prisma.user.update({
      where: { id: userRecord.id },
      data: { lastLoginAt: new Date() },
    }).catch((err) => {
      log.warn('Failed to update last login', err);
    });

    // Generate token and set cookie
    const token = signJwt({ id: userRecord.id, email: userRecord.email });
    setAuthCookie(token);

    const user = {
      id: userRecord.id,
      email: userRecord.email,
      firstName: userRecord.firstName,
      lastName: userRecord.lastName,
      createdAt: userRecord.createdAt,
    };

    log.info('Login successful', { userId: user.id });
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    log.error('Login error', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(generalLimiter, handleLogin);
