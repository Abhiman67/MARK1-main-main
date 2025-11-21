/**
 * AI Career Coach API Route
 * Production-ready endpoint with dynamic configuration, rate limiting, and error handling
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { aiService } from '@/lib/ai-service';
import { withRateLimit, aiLimiter } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';
import { config } from '@/lib/config';

const log = logger.scope('CoachAPI');

// Request validation schema
const CoachRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  resumeContext: z.string().optional(),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'ai']),
    content: z.string(),
  })).optional(),
});

/**
 * Generate contextual follow-up suggestions
 */
function generateSuggestions(userMessage: string, aiResponse: string): string[] {
  const lowerMessage = userMessage.toLowerCase();
  const lowerResponse = aiResponse.toLowerCase();

  const suggestionMap: Record<string, string[]> = {
    interview: [
      'What are common technical interview questions?',
      'How to prepare for system design interviews?',
      'Practice behavioral interview questions',
    ],
    salary: [
      'Research market salary rates',
      'Create a negotiation script',
      'Evaluate total compensation package',
    ],
    transition: [
      'Create a transition roadmap',
      'Identify transferable skills',
      'Build portfolio projects',
    ],
    resume: [
      'Optimize resume for ATS',
      'Add quantifiable achievements',
      'Improve resume structure',
    ],
    skill: [
      'Create a learning plan',
      'Find online courses',
      'Build practice projects',
    ],
  };

  // Find matching category
  for (const [keyword, suggestions] of Object.entries(suggestionMap)) {
    if (lowerMessage.includes(keyword) || lowerResponse.includes(keyword)) {
      return suggestions;
    }
  }

  // Default suggestions
  return [
    'How can I improve my resume?',
    'Plan my career progression',
    'Prepare for interviews',
  ];
}

/**
 * Main handler with rate limiting
 */
async function handleCoachRequest(req: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  
  try {
    // Check if AI service is available
    if (!aiService.isAvailable()) {
      log.error('AI service not available');
      return NextResponse.json(
        {
          error: 'AI service unavailable',
          message: 'No AI providers are configured. Please set GEMINI_API_KEY or OPENAI_API_KEY.',
          availableProviders: aiService.getAvailableProviders(),
        },
        { status: 503 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      log.warn('Invalid JSON in request body');
      return NextResponse.json(
        { error: 'Invalid JSON', message: 'Request body must be valid JSON' },
        { status: 400 }
      );
    }

    const validation = CoachRequestSchema.safeParse(body);
    if (!validation.success) {
      log.warn('Request validation failed', { errors: validation.error.flatten() });
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: 'Invalid request parameters',
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { message, resumeContext } = validation.data;

    log.info('Processing coach request', {
      messageLength: message.length,
      hasContext: !!resumeContext,
    });

    // Generate AI response
    let aiResponse;
    try {
      aiResponse = await aiService.generateResponse(message, resumeContext);
    } catch (error) {
      log.error('AI generation failed', error);
      return NextResponse.json(
        {
          error: 'AI generation failed',
          message: 'Failed to generate response. Please try again.',
          retryable: true,
        },
        { status: 500 }
      );
    }

    // Generate suggestions
    const suggestions = generateSuggestions(message, aiResponse.content);

    const duration = Date.now() - startTime;
    log.info('Coach request completed', {
      duration,
      provider: aiResponse.provider,
      model: aiResponse.model,
      responseLength: aiResponse.content.length,
    });

    // Add performance metrics header
    const response = NextResponse.json({
      response: aiResponse.content,
      suggestions,
      metadata: {
        provider: aiResponse.provider,
        model: aiResponse.model,
        tokensUsed: aiResponse.tokensUsed,
        processingTime: duration,
      },
    });

    if (config.get('ENABLE_API_METRICS')) {
      response.headers.set('X-Response-Time', `${duration}ms`);
      response.headers.set('X-AI-Provider', aiResponse.provider);
    }

    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    log.error('Unexpected error in coach endpoint', error, { duration });
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}

// Export with rate limiting
export const POST = withRateLimit(aiLimiter, handleCoachRequest);
