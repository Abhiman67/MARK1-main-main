/**
 * Centralized Configuration Management
 * Validates and exposes environment variables with type safety
 */

import { z } from 'zod';

const envSchema = z.object({
  // Database (allow any string to avoid dropping config during dev)
  DATABASE_URL: z.string().optional(),
  
  // AI Providers
  GEMINI_API_KEY: z.string().min(1).optional(),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_MODEL: z.string().default('gpt-4-turbo-preview'),
  
  // Auth
  JWT_SECRET: z.string().optional(),
  JWT_EXPIRY_SECONDS: z.coerce.number().default(60 * 60 * 24 * 7), // 7 days
  TOKEN_COOKIE_NAME: z.string().default('auth-token'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60 * 1000), // 1 minute
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(10),
  AI_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(5),
  
  // App Config
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  
  // AI Config
  AI_TIMEOUT_MS: z.coerce.number().default(30000),
  AI_MAX_RETRIES: z.coerce.number().default(3),
  AI_FALLBACK_ENABLED: z.coerce.boolean().default(true),
  
  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  
  // Features
  ENABLE_MIDDLEWARE_AUTH: z.coerce.boolean().default(false),
  ENABLE_API_METRICS: z.coerce.boolean().default(true),
});

type EnvConfig = z.infer<typeof envSchema>;

class ConfigManager {
  private config: EnvConfig;
  private validationErrors: string[] = [];

  constructor() {
    this.config = this.loadAndValidate();
  }

  private loadAndValidate(): EnvConfig {
    const env = {
      DATABASE_URL: process.env.DATABASE_URL,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      GEMINI_MODEL: process.env.GEMINI_MODEL,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      OPENAI_MODEL: process.env.OPENAI_MODEL,
      JWT_SECRET: process.env.JWT_SECRET,
      JWT_EXPIRY_SECONDS: process.env.JWT_EXPIRY_SECONDS,
      TOKEN_COOKIE_NAME: process.env.TOKEN_COOKIE_NAME,
      RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
      RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS,
      AI_RATE_LIMIT_MAX_REQUESTS: process.env.AI_RATE_LIMIT_MAX_REQUESTS,
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      AI_TIMEOUT_MS: process.env.AI_TIMEOUT_MS,
      AI_MAX_RETRIES: process.env.AI_MAX_RETRIES,
      AI_FALLBACK_ENABLED: process.env.AI_FALLBACK_ENABLED,
      LOG_LEVEL: process.env.LOG_LEVEL,
      ENABLE_MIDDLEWARE_AUTH: process.env.ENABLE_MIDDLEWARE_AUTH,
      ENABLE_API_METRICS: process.env.ENABLE_API_METRICS,
    };

    const result = envSchema.safeParse(env);

    if (!result.success) {
      this.validationErrors = result.error.issues.map(
        issue => `${issue.path.join('.')}: ${issue.message}`
      );
      console.warn('[CONFIG] Validation warnings:', this.validationErrors);
    }

    return result.success ? result.data : (envSchema.parse({}) as EnvConfig);
  }

  get<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
    return this.config[key];
  }

  getAll(): Readonly<EnvConfig> {
    return this.config;
  }

  getValidationErrors(): string[] {
    return [...this.validationErrors];
  }

  isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  hasDatabase(): boolean {
    return !!this.config.DATABASE_URL;
  }

  hasAIProvider(): boolean {
    return !!(this.config.GEMINI_API_KEY || this.config.OPENAI_API_KEY);
  }

  hasAuth(): boolean {
    return !!this.config.JWT_SECRET;
  }

  getAIProvider(): 'gemini' | 'openai' | null {
    if (this.config.GEMINI_API_KEY) return 'gemini';
    if (this.config.OPENAI_API_KEY) return 'openai';
    return null;
  }
}

// Singleton instance
export const config = new ConfigManager();

// Export types
export type { EnvConfig };
