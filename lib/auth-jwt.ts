/**
 * JWT Authentication Module
 * Production-ready JWT handling with dynamic configuration
 */

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { config } from './config';
import { logger } from './logger';

const log = logger.scope('Auth');

export interface JwtPayload {
  sub: string; // user id
  email: string;
  iat: number;
  exp: number;
}

class AuthService {
  private jwtSecret: string;
  private tokenCookieName: string;
  private tokenTTL: number;

  constructor() {
    // Use a development fallback that works in Edge Runtime
    const devFallback = 'dev-secret-min-32-chars-long-not-for-production-use-only';
    this.jwtSecret = config.get('JWT_SECRET') || devFallback;
    this.tokenCookieName = config.get('TOKEN_COOKIE_NAME');
    this.tokenTTL = config.get('JWT_EXPIRY_SECONDS');

    if (!config.get('JWT_SECRET')) {
      log.warn('JWT_SECRET not configured. Using dev fallback (NOT SECURE FOR PRODUCTION)');
    }
  }

  signJwt(user: { id: string; email: string }): string {
    try {
      const token = jwt.sign(
        { sub: user.id, email: user.email },
        this.jwtSecret,
        { expiresIn: this.tokenTTL }
      );
      log.debug('JWT signed', { userId: user.id });
      return token;
    } catch (error) {
      log.error('Failed to sign JWT', error);
      throw new Error('Authentication token generation failed');
    }
  }

  verifyJwt(token: string): JwtPayload | null {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as JwtPayload;
      log.debug('JWT verified', { userId: payload.sub });
      return payload;
    } catch (error) {
      log.debug('JWT verification failed', { error });
      return null;
    }
  }

  setAuthCookie(token: string): void {
    try {
      cookies().set({
        name: this.tokenCookieName,
        value: token,
        httpOnly: true,
        secure: config.isProduction(),
        sameSite: 'lax',
        path: '/',
        maxAge: this.tokenTTL,
      });
      log.debug('Auth cookie set');
    } catch (error) {
      log.error('Failed to set auth cookie', error);
      throw new Error('Failed to set authentication cookie');
    }
  }

  clearAuthCookie(): void {
    try {
      cookies().set({
        name: this.tokenCookieName,
        value: '',
        httpOnly: true,
        secure: config.isProduction(),
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      });
      log.debug('Auth cookie cleared');
    } catch (error) {
      log.error('Failed to clear auth cookie', error);
    }
  }

  getAuthTokenFromCookies(): string | null {
    try {
      const token = cookies().get(this.tokenCookieName)?.value;
      return token || null;
    } catch (error) {
      log.error('Failed to read auth cookie', error);
      return null;
    }
  }

  getCurrentUserId(): string | null {
    const token = this.getAuthTokenFromCookies();
    if (!token) return null;
    
    const payload = this.verifyJwt(token);
    return payload?.sub || null;
  }

  getCurrentUser(): { id: string; email: string } | null {
    const token = this.getAuthTokenFromCookies();
    if (!token) return null;
    
    const payload = this.verifyJwt(token);
    if (!payload) return null;
    
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}

// Singleton instance
const authService = new AuthService();

// Export methods for backward compatibility
export const signJwt = authService.signJwt.bind(authService);
export const verifyJwt = authService.verifyJwt.bind(authService);
export const setAuthCookie = authService.setAuthCookie.bind(authService);
export const clearAuthCookie = authService.clearAuthCookie.bind(authService);
export const getAuthTokenFromCookies = authService.getAuthTokenFromCookies.bind(authService);
export const getCurrentUserId = authService.getCurrentUserId.bind(authService);
export const getCurrentUser = authService.getCurrentUser.bind(authService);

// Export service instance
export { authService };
