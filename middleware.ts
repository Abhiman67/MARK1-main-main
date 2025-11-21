/**
 * Next.js Middleware
 * Dynamic authentication and security middleware
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { config as appConfig } from './lib/config';
import { verifyJwt } from './lib/auth-jwt';
import { logger } from './lib/logger';

const log = logger.scope('Middleware');

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/api/auth/login',
  '/api/auth/signup',
];

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/resume',
  '/coach',
  '/api/coach',
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route));
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

export function middleware(request: NextRequest) {
  // Skip if middleware auth is disabled
  if (!appConfig.get('ENABLE_MIDDLEWARE_AUTH')) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  if (isProtectedRoute(pathname)) {
    const token = request.cookies.get(appConfig.get('TOKEN_COOKIE_NAME'))?.value;

    if (!token) {
      log.warn('Unauthorized access attempt', { pathname });
      
      // Redirect to login for page requests
      if (!pathname.startsWith('/api/')) {
        const url = request.nextUrl.clone();
        url.pathname = '/auth/signin';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }

      // Return 401 for API requests
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyJwt(token);
    if (!payload) {
      log.warn('Invalid token', { pathname });

      if (!pathname.startsWith('/api/')) {
        const url = request.nextUrl.clone();
        url.pathname = '/auth/signin';
        url.searchParams.set('redirect', pathname);
        url.searchParams.set('error', 'session_expired');
        return NextResponse.redirect(url);
      }

      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Add user info to headers for downstream use
    const response = NextResponse.next();
    response.headers.set('X-User-Id', payload.sub);
    response.headers.set('X-User-Email', payload.email);
    return response;
  }

  return NextResponse.next();
}

// Configure which routes middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};