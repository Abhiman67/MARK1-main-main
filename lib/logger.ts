/**
 * Centralized Logging System
 * Provides structured logging with levels and metadata
 */

import { config } from './config';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogMetadata {
  [key: string]: any;
}

class Logger {
  private level: LogLevel;

  constructor() {
    const configLevel = config.get('LOG_LEVEL');
    this.level = this.parseLogLevel(configLevel);
  }

  private parseLogLevel(level: string): LogLevel {
    switch (level.toLowerCase()) {
      case 'debug':
        return LogLevel.DEBUG;
      case 'info':
        return LogLevel.INFO;
      case 'warn':
        return LogLevel.WARN;
      case 'error':
        return LogLevel.ERROR;
      default:
        return LogLevel.INFO;
    }
  }

  private formatMessage(level: string, message: string, meta?: LogMetadata): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  debug(message: string, meta?: LogMetadata): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage('DEBUG', message, meta));
    }
  }

  info(message: string, meta?: LogMetadata): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', message, meta));
    }
  }

  warn(message: string, meta?: LogMetadata): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message, meta));
    }
  }

  error(message: string, error?: Error | unknown, meta?: LogMetadata): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorMeta = error instanceof Error
        ? { ...meta, error: error.message, stack: error.stack }
        : { ...meta, error };
      console.error(this.formatMessage('ERROR', message, errorMeta));
    }
  }

  // Scoped logger for specific modules
  scope(moduleName: string): ScopedLogger {
    return new ScopedLogger(this, moduleName);
  }
}

class ScopedLogger {
  constructor(
    private logger: Logger,
    private moduleName: string
  ) {}

  private addScope(message: string): string {
    return `[${this.moduleName}] ${message}`;
  }

  debug(message: string, meta?: LogMetadata): void {
    this.logger.debug(this.addScope(message), meta);
  }

  info(message: string, meta?: LogMetadata): void {
    this.logger.info(this.addScope(message), meta);
  }

  warn(message: string, meta?: LogMetadata): void {
    this.logger.warn(this.addScope(message), meta);
  }

  error(message: string, error?: Error | unknown, meta?: LogMetadata): void {
    this.logger.error(this.addScope(message), error, meta);
  }
}

// Singleton instance
export const logger = new Logger();

// Export types
export type { LogMetadata, ScopedLogger };
