import { useMemo } from 'react';

export interface ResumeVersion {
  id: string;
  timestamp: Date;
  label: string;
  data: any;
}

export interface Resume {
  id: string;
  name?: string;
  template?: string;
  isDefault?: boolean;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    title: string;
    location: string;
    linkedin?: string;
    website?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements: string[];
    current: boolean;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: string[];
  projects?: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    startDate?: string;
    endDate?: string;
    highlights: string[];
  }>;
  certifications?: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    credentialId?: string;
    verificationUrl?: string;
  }>;
  languages?: Array<{
    id: string;
    language: string;
    proficiency: 'Native' | 'Fluent' | 'Intermediate' | 'Basic';
  }>;
  links?: Array<{
    id: string;
    platform: string;
    url: string;
  }>;
  versions?: ResumeVersion[];
  atsScore?: number;
  lastModified?: Date;
}

const KEYWORDS = [
  'react', 'typescript', 'node', 'node.js', 'javascript', 'python', 'aws', 'sql', 'java', 'docker'
];

/**
 * Calculates ATS (Applicant Tracking System) score for a resume
 * based on completeness, keywords, quantified achievements, and sections
 */
export function calculateATSScore(resume: Resume | null): number {
  if (!resume) return 0;
  
  let score = 50; // baseline

  // Contact completeness (max 10 points)
  const contactFields = [
    resume.personalInfo.fullName,
    resume.personalInfo.email,
    resume.personalInfo.phone,
    resume.personalInfo.title
  ];
  const contactComplete = contactFields.filter(Boolean).length;
  score += Math.min(10, contactComplete * 3);

  // Summary length (8 points)
  if ((resume.summary || '').trim().length > 60) {
    score += 8;
  }

  // Skills count (max 15 points)
  score += Math.min(15, (resume.skills?.length || 0) * 2);

  // Quantified achievements detection (max 15 points)
  const quantified = resume.experience.reduce((acc, exp) => {
    const q = exp.achievements.filter(achievement =>
      /\d+%|\d+\s?(people|users|customers|sales)|\b\d+\b/.test(achievement)
    ).length;
    return acc + q;
  }, 0);
  score += Math.min(15, quantified * 5);

  // Keyword matching (max 10 points)
  const text = [
    resume.summary,
    ...resume.experience.map(e => e.description + ' ' + e.achievements.join(' ')),
    resume.skills.join(' ')
  ].join(' ').toLowerCase();
  
  let keywordMatches = 0;
  KEYWORDS.forEach(keyword => {
    if (text.includes(keyword)) keywordMatches++;
  });
  score += Math.min(10, keywordMatches * 2);

  // Projects bonus (5 points)
  if (resume.projects && resume.projects.length > 0) {
    score += 5;
  }

  // Certifications bonus (10 points)
  if (resume.certifications && resume.certifications.length > 0) {
    score += 10;
  }

  // Languages bonus (max 5 points)
  if (resume.languages && resume.languages.length > 0) {
    score += Math.min(5, resume.languages.length * 2);
  }

  // Portfolio/GitHub links bonus
  if (resume.links && resume.links.length > 0) {
    const hasGithub = resume.links.some(link => link.platform === 'GitHub');
    const hasLinkedIn = resume.links.some(link => link.platform === 'LinkedIn');
    if (hasGithub) score += 5;
    if (hasLinkedIn) score += 3;
  }

  // Clamp score between 10 and 95
  return Math.max(10, Math.min(95, Math.round(score)));
}

/**
 * Hook that calculates and memoizes the ATS score for a resume
 * Only recalculates when the resume object changes
 */
export function useATSScore(resume: Resume | null): number {
  return useMemo(() => calculateATSScore(resume), [resume]);
}

/**
 * Returns color class based on score value
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

/**
 * Returns status label based on score value
 */
export function getScoreStatus(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  return 'Needs Work';
}
