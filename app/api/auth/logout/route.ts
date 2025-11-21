/**
 * Logout API Route
 * Clears authentication cookie
 */

import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth-jwt';
import { logger } from '@/lib/logger';

const log = logger.scope('AuthLogout');

export async function POST() {
  try {
    clearAuthCookie();
    log.info('Logout successful');
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    log.error('Logout error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
