export interface ImportedResumeData {
  personalInfo: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    title?: string;
  };
  summary?: string;
  skills: string[];
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  links: Array<{
    type: string;
    url: string;
  }>;
}

/**
 * Extract text content from PDF file using browser API
 */
export async function parsePDF(file: File): Promise<string> {
  try {
    // For now, we'll use a simpler approach - read as text
    // In production, you'd use pdf.js or similar browser-compatible library
    const text = await file.text();
    return text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF file. Please ensure it contains text content.');
  }
}

/**
 * Extract text content from DOCX file
 */
export async function parseDOCX(file: File): Promise<string> {
  try {
    // Simple text extraction
    const text = await file.text();
    return text;
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error('Failed to parse DOCX file.');
  }
}

/**
 * Extract email from text using regex
 */
function extractEmail(text: string): string | undefined {
  try {
    const emailRegex = /[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/g;
    const match = text.match(emailRegex);
    return match && match[0] ? match[0] : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Extract phone number from text using regex
 */
function extractPhone(text: string): string | undefined {
  try {
    // More flexible phone patterns
    const patterns = [
      /\+?\d{1,3}[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/,
      /\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/,
      /\d{3}[\s.-]?\d{3}[\s.-]?\d{4}/,
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[0]) {
        return match[0];
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
}

/**
 * Extract URLs from text
 */
function extractURLs(text: string): string[] {
  try {
    const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g;
    const matches = text.match(urlRegex);
    return matches || [];
  } catch {
    return [];
  }
}

/**
 * Categorize URLs into link types (LinkedIn, GitHub, Portfolio, etc.)
 */
function categorizeLinks(urls: string[]): Array<{ type: string; url: string }> {
  return urls.map(url => {
    if (url.includes('linkedin.com')) return { type: 'LinkedIn', url };
    if (url.includes('github.com')) return { type: 'GitHub', url };
    if (url.includes('gitlab.com')) return { type: 'GitLab', url };
    if (url.includes('twitter.com') || url.includes('x.com')) return { type: 'Twitter', url };
    return { type: 'Website', url };
  });
}

/**
 * Extract skills from text by matching common technical keywords
 */
function extractSkills(text: string): string[] {
  const commonSkills = [
    // Programming languages
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'go', 'rust',
    // Frontend
    'react', 'vue', 'angular', 'html', 'css', 'sass', 'tailwind', 'bootstrap', 'jquery',
    // Backend
    'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', '.net',
    // Databases
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'dynamodb', 'firebase',
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'ci/cd', 'git', 'github',
    // Mobile
    'react native', 'flutter', 'ios', 'android',
    // Other
    'graphql', 'rest api', 'api', 'machine learning', 'ai', 'tensorflow', 'pytorch',
    'agile', 'scrum', 'jira', 'figma', 'photoshop'
  ];

  const lowerText = text.toLowerCase();
  const foundSkills = new Set<string>();

  commonSkills.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.add(skill);
    }
  });

  return Array.from(foundSkills);
}

/**
 * Detect sections in resume text
 */
function detectSections(text: string): { [key: string]: string } {
  const sections: { [key: string]: string } = {};
  const lines = text.split('\n');
  
  let currentSection = 'unknown';
  let currentContent: string[] = [];

  const sectionHeaders = [
    { key: 'summary', patterns: ['summary', 'about', 'profile', 'objective'] },
    { key: 'experience', patterns: ['experience', 'work history', 'employment', 'work experience'] },
    { key: 'education', patterns: ['education', 'academic', 'qualifications'] },
    { key: 'skills', patterns: ['skills', 'technical skills', 'core competencies', 'expertise'] },
    { key: 'projects', patterns: ['projects', 'portfolio'] },
    { key: 'certifications', patterns: ['certifications', 'certificates', 'licenses'] },
    { key: 'languages', patterns: ['languages'] }
  ];

  lines.forEach(line => {
    const trimmedLine = line.trim().toLowerCase();
    
    // Check if line is a section header
    let foundSection = false;
    for (const section of sectionHeaders) {
      if (section.patterns.some(pattern => trimmedLine === pattern || trimmedLine.startsWith(pattern))) {
        // Save previous section
        if (currentContent.length > 0) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        // Start new section
        currentSection = section.key;
        currentContent = [];
        foundSection = true;
        break;
      }
    }

    if (!foundSection && line.trim()) {
      currentContent.push(line);
    }
  });

  // Save last section
  if (currentContent.length > 0) {
    sections[currentSection] = currentContent.join('\n').trim();
  }

  return sections;
}

/**
 * Parse structured resume data from extracted text
 */
export function parseResumeText(text: string): ImportedResumeData {
  const sections = detectSections(text);
  const urls = extractURLs(text);
  
  // Extract personal info from first few lines
  const lines = text.split('\n').filter(l => l.trim());
  const firstLines = lines.slice(0, 5).join(' ');
  
  const personalInfo = {
    fullName: lines[0]?.trim() || undefined,
    email: extractEmail(text),
    phone: extractPhone(text),
    location: undefined,
    title: lines[1]?.trim() || undefined,
  };

  const data: ImportedResumeData = {
    personalInfo,
    summary: sections.summary,
    skills: extractSkills(text),
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
    links: categorizeLinks(urls),
  };

  return data;
}

/**
 * Main import function - handles PDF, DOCX, and TXT
 */
export async function importResume(file: File): Promise<ImportedResumeData> {
  try {
    const fileType = file.name.toLowerCase().split('.').pop();
    
    let text: string;
    
    if (fileType === 'pdf') {
      text = await parsePDF(file);
    } else if (fileType === 'docx') {
      text = await parseDOCX(file);
    } else if (fileType === 'txt') {
      text = await file.text();
    } else {
      throw new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
    }

    if (!text || text.trim().length === 0) {
      throw new Error('Could not extract text from the file. The file may be empty or corrupted.');
    }

    return parseResumeText(text);
  } catch (error) {
    console.error('Resume import error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to import resume. Please try a different file format or paste your resume as text.');
  }
}
