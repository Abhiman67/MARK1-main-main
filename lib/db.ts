/**
 * Database Client
 * Production-ready Prisma client with connection pooling and error handling
 */

import { PrismaClient } from './generated/prisma/client';
import { config } from './config';
import { logger } from './logger';

const log = logger.scope('Database');

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient | null {
  if (!config.hasDatabase()) {
    log.warn('DATABASE_URL not configured. Database features will be unavailable.');
    return null;
  }

  try {
    const logLevel = config.isDevelopment() ? ['query', 'error', 'warn'] : ['error'];
    
    const client = new PrismaClient({
      log: logLevel.map(level => ({ emit: 'stdout' as const, level: level as any })),
      errorFormat: config.isDevelopment() ? 'pretty' : 'minimal',
    });

    log.info('Prisma client initialized');
    return client;
  } catch (error) {
    log.error('Failed to initialize Prisma client', error);
    return null;
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (config.isDevelopment() && prisma) {
  globalForPrisma.prisma = prisma;
}

/**
 * Check if database is available
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  if (!prisma) return false;
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    log.error('Database connection check failed', error);
    return false;
  }
}

/**
 * Graceful shutdown
 */
export async function disconnectDatabase(): Promise<void> {
  if (prisma) {
    try {
      await prisma.$disconnect();
      log.info('Database disconnected');
    } catch (error) {
      log.error('Error disconnecting database', error);
    }
  }
}
