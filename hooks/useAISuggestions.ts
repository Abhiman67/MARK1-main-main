import { useState, useEffect } from 'react';
import type { Resume } from './useATSScore';

export type SuggestionType = 'improvement' | 'keyword' | 'format' | 'content';
export type SuggestionImpact = 'high' | 'medium' | 'low';

export interface AISuggestion {
  type: SuggestionType;
  title: string;
  description: string;
  impact: SuggestionImpact;
  keywords?: string[];
}

const KEYWORDS = [
  'react', 'typescript', 'node', 'node.js', 'javascript', 'python', 'aws', 'sql', 'java', 'docker'
];

/**
 * Generates static fallback suggestions for resume improvement
 * Used when AI service is unavailable or as initial suggestions
 */
export function generateStaticSuggestions(resume: Resume | null): AISuggestion[] {
  if (!resume) return [];
  
  const suggestions: AISuggestion[] = [];

  // Contact Information Check
  if (!resume.personalInfo.email || !resume.personalInfo.phone) {
    suggestions.push({
      type: 'improvement',
      title: 'Add contact information',
      description: 'Include a phone number and email for recruiters to reach you',
      impact: 'high',
    });
  }

  // Professional Summary Check
  const summaryLength = (resume.summary || '').trim().length;
  if (summaryLength === 0) {
    suggestions.push({
      type: 'content',
      title: 'Add a professional summary',
      description: 'Write a compelling 2-3 sentence summary highlighting your expertise and value proposition',
      impact: 'high',
    });
  } else if (summaryLength < 60) {
    suggestions.push({
      type: 'improvement',
      title: 'Expand your professional summary',
      description: 'Write a concise summary with your role, years of experience and top skills (aim for 60+ characters)',
      impact: 'medium',
    });
  }

  // Skills - Keyword Matching
  const currentSkills = resume.skills.map(s => s.toLowerCase());
  const missingKeywords = KEYWORDS.filter(keyword => !currentSkills.includes(keyword));
  
  if (missingKeywords.length > 0) {
    suggestions.push({
      type: 'keyword',
      title: 'Add relevant technical keywords',
      description: `Consider adding: ${missingKeywords.slice(0, 5).join(', ')}`,
      impact: 'medium',
      keywords: missingKeywords.slice(0, 5),
    });
  }

  // Experience - Achievements Check
  const totalAchievements = resume.experience.reduce((acc, exp) => 
    acc + (exp.achievements?.length || 0), 0
  );
  const expectedAchievements = Math.max(3, resume.experience.length * 2);
  
  if (totalAchievements < expectedAchievements) {
    suggestions.push({
      type: 'improvement',
      title: 'Add more achievements',
      description: 'Aim for 2-4 achievements per role, include metrics where possible',
      impact: 'high',
    });
  }

  // Quantified Achievements Check
  const quantifiedCount = resume.experience.reduce((acc, exp) => {
    const quantified = exp.achievements.filter(achievement =>
      /\d+%|\d+\s?(people|users|customers|sales|million|thousand)|\b\d+\b/.test(achievement)
    ).length;
    return acc + quantified;
  }, 0);

  if (quantifiedCount < Math.max(2, resume.experience.length)) {
    suggestions.push({
      type: 'content',
      title: 'Quantify your achievements',
      description: 'Add numbers, percentages, or metrics to demonstrate impact (e.g., "Increased sales by 35%")',
      impact: 'high',
    });
  }

  // Projects Check
  if (!resume.projects || resume.projects.length === 0) {
    suggestions.push({
      type: 'content',
      title: 'Add relevant projects',
      description: 'Showcase 2-3 key projects to demonstrate hands-on experience and technical skills',
      impact: 'medium',
    });
  }

  // Certifications Check
  if (!resume.certifications || resume.certifications.length === 0) {
    suggestions.push({
      type: 'improvement',
      title: 'Add professional certifications',
      description: 'Include relevant certifications to boost credibility (e.g., AWS, Google, Microsoft)',
      impact: 'low',
    });
  }

  // LinkedIn/GitHub Links
  if (!resume.links || resume.links.length === 0) {
    suggestions.push({
      type: 'improvement',
      title: 'Add professional links',
      description: 'Include LinkedIn, GitHub, or portfolio links to provide more context about your work',
      impact: 'medium',
    });
  } else {
    const hasGitHub = resume.links.some(link => link.platform === 'GitHub');
    const hasLinkedIn = resume.links.some(link => link.platform === 'LinkedIn');
    
    if (!hasGitHub && !hasLinkedIn) {
      suggestions.push({
        type: 'improvement',
        title: 'Add LinkedIn and GitHub profiles',
        description: 'Link your LinkedIn and GitHub to showcase your professional network and code samples',
        impact: 'medium',
      });
    }
  }

  // Section Order Formatting
  suggestions.push({
    type: 'format',
    title: 'Optimize section order',
    description: 'Place Skills near the top for better ATS scanning and recruiter visibility',
    impact: 'low',
  });

  // Length Check
  if (resume.experience.length === 0) {
    suggestions.push({
      type: 'content',
      title: 'Add work experience',
      description: 'Include your professional experience with roles, responsibilities, and achievements',
      impact: 'high',
    });
  }

  return suggestions;
}

/**
 * Hook that fetches AI-powered suggestions from Gemini API
 * Falls back to static suggestions if API fails
 */
export function useAISuggestions(
  resume: Resume | null,
  options?: { auto?: boolean }
): {
  suggestions: AISuggestion[];
  isLoading: boolean;
  isAIPowered: boolean;
  provider?: string | null;
  cached?: boolean;
  analyze: () => Promise<void>;
} {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>(() =>
    generateStaticSuggestions(resume)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isAIPowered, setIsAIPowered] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);
  const [cached, setCached] = useState(false);

  // Internal fetch function used by both auto and manual triggers
  const fetchAISuggestions = async (signal?: AbortSignal) => {
    if (!resume) return;

    setSuggestions(generateStaticSuggestions(resume));
    setIsLoading(true);
    setIsAIPowered(false);
    setProvider(null);
    setCached(false);

    try {
      const controller = new AbortController();
      const composedSignal = signal ?? controller.signal;

      const resp = await fetch('/api/resume/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume }),
        signal: composedSignal,
      });

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const data = await resp.json();

      setSuggestions(data.suggestions || generateStaticSuggestions(resume));
      setIsAIPowered(!data.fallback);
      setProvider(data.provider || null);
      setCached(Boolean(data.cached));
    } catch (err) {
      console.error('Failed to fetch AI suggestions:', err);
      setSuggestions(generateStaticSuggestions(resume));
      setIsAIPowered(false);
      setProvider(null);
      setCached(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto behavior (keeps previous debounce behavior)
  useEffect(() => {
    if (!resume) {
      setSuggestions([]);
      setIsAIPowered(false);
      return;
    }

    if (options?.auto === false) return; // manual mode

    let cancelled = false;
    const controller = new AbortController();

    const id = setTimeout(() => {
      if (!cancelled) fetchAISuggestions(controller.signal);
    }, 1000);

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(id);
    };
  }, [resume, options?.auto]);

  const analyze = async () => {
    const controller = new AbortController();
    // Short timeout to keep UI responsive
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      await fetchAISuggestions(controller.signal);
    } finally {
      clearTimeout(timeout);
    }
  };

  return { suggestions, isLoading, isAIPowered, provider, cached, analyze };
}

/**
 * Gets the color class for suggestion impact badges
 */
export function getImpactColor(impact: SuggestionImpact): string {
  switch (impact) {
    case 'high':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'low':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

/**
 * Gets the icon name for suggestion types
 */
export function getSuggestionIcon(type: SuggestionType): string {
  switch (type) {
    case 'improvement':
      return 'lightbulb';
    case 'keyword':
      return 'tag';
    case 'format':
      return 'layout';
    case 'content':
      return 'file-text';
    default:
      return 'alert-circle';
  }
}
