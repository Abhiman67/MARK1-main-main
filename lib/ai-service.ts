/**
 * AI Service Factory
 * Dynamic AI provider selection with fallback strategies
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from './config';
import { logger } from './logger';

const log = logger.scope('AIService');

export interface AIResponse {
  content: string;
  provider: string;
  model: string;
  tokensUsed?: number;
}

export interface AIProvider {
  generateResponse(prompt: string, context?: string): Promise<AIResponse>;
  isAvailable(): boolean;
  getName(): string;
}

/**
 * Gemini AI Provider
 */
class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI | null = null;
  private apiKey: string | undefined;
  private model: string;
  private fallbackModels = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.0-flash-001',
    'gemini-1.5-flash',
  ];

  constructor() {
    this.apiKey = config.get('GEMINI_API_KEY');
    this.model = config.get('GEMINI_MODEL');
    
    if (this.apiKey) {
      this.client = new GoogleGenerativeAI(this.apiKey);
      log.info('Gemini provider initialized', { model: this.model });
    }
  }

  isAvailable(): boolean {
    return !!(this.client && this.apiKey);
  }

  getName(): string {
    return 'gemini';
  }

  private buildSystemPrompt(context?: string): string {
    return `You are an expert AI Career Coach with deep knowledge of:
- Software engineering career paths and transitions
- Technical skill development and learning strategies
- Interview preparation (technical, behavioral, system design)
- Salary negotiation and compensation analysis
- Resume optimization and ATS best practices
- Portfolio development and personal branding
- Industry trends and emerging technologies

${context ? `\nUser's Resume Context:\n${context}\n\nUse this information to provide personalized, actionable advice tailored to their specific background and goals.\n` : ''}

Guidelines:
- Be encouraging but honest
- Provide specific, actionable recommendations
- Use examples and frameworks when helpful
- Keep responses concise but thorough (250-400 words)
- Format with markdown for readability`;
  }

  async generateResponse(prompt: string, context?: string): Promise<AIResponse> {
    if (!this.client || !this.apiKey) {
      throw new Error('Gemini client not initialized');
    }

    const systemPrompt = this.buildSystemPrompt(context);
    const fullPrompt = `${systemPrompt}\n\nUser Question: ${prompt}`;

    // Try SDK first
    try {
      log.debug('Attempting Gemini SDK request', { model: this.model });
      const model = this.client.getGenerativeModel({ model: this.model });
      const result = await model.generateContent(fullPrompt);
      const response = result.response;
      const text = response.text();

      if (text) {
        log.info('Gemini SDK request successful', { model: this.model, length: text.length });
        return {
          content: text,
          provider: 'gemini',
          model: this.model,
        };
      }
    } catch (error) {
      log.warn('Gemini SDK failed, trying REST fallback', { error });
    }

    // Try REST API with fallback models
    for (const modelName of [this.model, ...this.fallbackModels]) {
      for (const apiVersion of ['v1', 'v1beta'] as const) {
        try {
          log.debug('Attempting Gemini REST request', { model: modelName, apiVersion });
          const response = await this.callRestAPI(modelName, apiVersion, fullPrompt);
          
          if (response) {
            log.info('Gemini REST request successful', { model: modelName, apiVersion });
            return {
              content: response,
              provider: 'gemini',
              model: modelName,
            };
          }
        } catch (error) {
          log.debug('Gemini REST attempt failed', { model: modelName, apiVersion, error });
        }
      }
    }

    throw new Error('All Gemini attempts failed');
  }

  private async callRestAPI(
    modelName: string,
    apiVersion: 'v1' | 'v1beta',
    prompt: string
  ): Promise<string | null> {
    const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent?key=${this.apiKey}`;
    
    const timeoutMs = config.get('AI_TIMEOUT_MS');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`REST ${apiVersion} error: ${response.status} - ${errorText}`);
      }

      const json = await response.json();
      const parts = json?.candidates?.[0]?.content?.parts || [];
      const text = parts.map((p: any) => p.text).filter(Boolean).join('\n');
      
      return text || null;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
}

/**
 * OpenAI Provider (placeholder for future implementation)
 */
class OpenAIProvider implements AIProvider {
  private apiKey: string | undefined;
  private model: string;

  constructor() {
    this.apiKey = config.get('OPENAI_API_KEY');
    this.model = config.get('OPENAI_MODEL');
    
    if (this.apiKey) {
      log.info('OpenAI provider initialized', { model: this.model });
    }
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  getName(): string {
    return 'openai';
  }

  async generateResponse(prompt: string, context?: string): Promise<AIResponse> {
    // TODO: Implement OpenAI integration
    throw new Error('OpenAI provider not yet implemented');
  }
}

/**
 * AI Service Manager with fallback logic
 */
class AIService {
  private providers: AIProvider[];
  private primaryProvider: AIProvider | null = null;

  constructor() {
    this.providers = [
      new GeminiProvider(),
      new OpenAIProvider(),
    ].filter(p => p.isAvailable());

    this.primaryProvider = this.providers[0] || null;

    if (!this.primaryProvider) {
      log.warn('No AI providers available');
    } else {
      log.info('AI service initialized', { 
        primary: this.primaryProvider.getName(),
        available: this.providers.map(p => p.getName()),
      });
    }
  }

  isAvailable(): boolean {
    return this.providers.length > 0;
  }

  async generateResponse(prompt: string, context?: string): Promise<AIResponse> {
    if (!this.isAvailable()) {
      throw new Error('No AI providers available. Please configure GEMINI_API_KEY or OPENAI_API_KEY.');
    }

    const maxRetries = config.get('AI_MAX_RETRIES');
    const fallbackEnabled = config.get('AI_FALLBACK_ENABLED');

    // Try primary provider with retries
    if (this.primaryProvider) {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          log.debug('Attempting AI request', { 
            provider: this.primaryProvider.getName(), 
            attempt 
          });
          
          const response = await this.primaryProvider.generateResponse(prompt, context);
          return response;
        } catch (error) {
          log.warn('AI request failed', { 
            provider: this.primaryProvider.getName(), 
            attempt, 
            error 
          });
          
          if (attempt === maxRetries) {
            log.error('All retries exhausted for primary provider');
          }
        }
      }
    }

    // Try fallback providers
    if (fallbackEnabled && this.providers.length > 1) {
      log.info('Attempting fallback providers');
      
      for (const provider of this.providers.slice(1)) {
        try {
          log.debug('Attempting fallback provider', { provider: provider.getName() });
          const response = await provider.generateResponse(prompt, context);
          log.info('Fallback provider succeeded', { provider: provider.getName() });
          return response;
        } catch (error) {
          log.warn('Fallback provider failed', { 
            provider: provider.getName(), 
            error 
          });
        }
      }
    }

    throw new Error('All AI providers failed');
  }

  getAvailableProviders(): string[] {
    return this.providers.map(p => p.getName());
  }
}

// Singleton instance
export const aiService = new AIService();
