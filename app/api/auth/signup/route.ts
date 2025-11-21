/**
 * Signup API Route
 * Production-ready user registration with validation and rate limiting
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { signJwt, setAuthCookie } from '@/lib/auth-jwt';
import { withRateLimit, generalLimiter } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';
import { config } from '@/lib/config';

const log = logger.scope('AuthSignup');

const SignUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

async function handleSignup(req: NextRequest): Promise<NextResponse> {
  try {
    // Check if database is available
    if (!prisma) {
      log.error('Database not available');
      return NextResponse.json(
        { error: 'Service unavailable', message: 'Registration service is not configured' },
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

    const validation = SignUpSchema.safeParse(body);
    if (!validation.success) {
      log.debug('Validation failed', { errors: validation.error.flatten() });
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password } = validation.data;
    log.info('Signup attempt', { email });

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      log.warn('Signup failed: email already in use', { email });
      return NextResponse.json(
        { error: 'Email already in use', message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    // Generate token and set cookie
    const token = signJwt({ id: user.id, email: user.email });
    setAuthCookie(token);

    log.info('Signup successful', { userId: user.id });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    log.error('Signup error', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(generalLimiter, handleSignup);
