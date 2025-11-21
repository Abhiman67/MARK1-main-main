import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';
import type { Resume } from '@/hooks/useATSScore';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// In-memory cache with TTL (5 minutes)
const suggestionCache = new Map<string, { suggestions: any[]; provider: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Clean expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  suggestionCache.forEach((value, key) => {
    if (now - value.timestamp > CACHE_TTL) {
      suggestionCache.delete(key);
    }
  });
}, 60 * 1000); // Clean every minute

interface SuggestionRequest {
  resume: Resume;
}

export async function POST(request: NextRequest) {
  try {
    const { resume } = await request.json() as SuggestionRequest;

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume data is required' },
        { status: 400 }
      );
    }

    // Generate cache key from resume content hash
    const resumeHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(resume))
      .digest('hex')
      .substring(0, 16);

    // Check cache first
    const cached = suggestionCache.get(resumeHash);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({
        suggestions: cached.suggestions,
        provider: cached.provider,
        cached: true,
      });
    }

    // Build comprehensive resume context for AI
    const resumeContext = buildResumeContext(resume);

    // Create a detailed prompt for AI to analyze the resume
    const prompt = `Analyze this resume and provide 5-8 specific, actionable suggestions for improvement. Focus on:

1. **ATS Optimization**: Keywords, formatting, section structure
2. **Content Quality**: Achievement quantification, impact statements, clarity
3. **Completeness**: Missing sections, incomplete information
4. **Professional Branding**: Summary strength, skill positioning, links

For each suggestion, provide:
- A clear, actionable title (5-7 words)
- A detailed description with specific examples or guidance
- Impact level (high/medium/low) based on potential improvement to ATS score and recruiter appeal
- Type (improvement/keyword/format/content)

Format your response as a JSON array of suggestion objects. Each suggestion must have:
{
  "type": "improvement" | "keyword" | "format" | "content",
  "title": "Clear actionable title",
  "description": "Detailed guidance with examples",
  "impact": "high" | "medium" | "low",
  "keywords": ["optional", "array", "of", "keywords"] // only for keyword type
}

Resume Context:
${resumeContext}`;

    // Generate AI suggestions with retry logic
    let aiResponse;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount <= maxRetries) {
      try {
        aiResponse = await aiService.generateResponse(prompt);
        break; // Success, exit retry loop
      } catch (error: any) {
        retryCount++;
        
        // Check for rate limit (429)
        if (error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
          if (retryCount > maxRetries) {
            throw error; // Give up after max retries
          }
          
          // Exponential backoff: 2^retryCount seconds
          const backoffMs = Math.pow(2, retryCount) * 1000;
          console.log(`Rate limited, retrying in ${backoffMs}ms (attempt ${retryCount}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
        } else {
          throw error; // Non-retryable error
        }
      }
    }
    
    if (!aiResponse) {
      throw new Error('Failed to generate AI response after retries');
    }
    
    // Parse AI response (expecting JSON array)
    let suggestions;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.content.match(/```(?:json)?\n?([\s\S]*?)\n?```/) || 
                       [null, aiResponse.content];
      const jsonStr = jsonMatch[1].trim();
      suggestions = JSON.parse(jsonStr);
      
      if (!Array.isArray(suggestions)) {
        suggestions = [suggestions];
      }
    } catch (parseError) {
      console.error('Failed to parse AI suggestions:', parseError);
      
      // Fallback: return generic suggestions if parsing fails
      return NextResponse.json({
        suggestions: getGenericSuggestions(resume),
        provider: aiResponse.provider,
        fallback: true,
      });
    }

    // Store in cache
    suggestionCache.set(resumeHash, {
      suggestions,
      provider: aiResponse.provider,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      suggestions,
      provider: aiResponse.provider,
      model: aiResponse.model,
      cached: false,
    });

  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    
    // Return generic suggestions on error
    const { resume } = await request.json() as SuggestionRequest;
    return NextResponse.json({
      suggestions: getGenericSuggestions(resume),
      fallback: true,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 200 }); // Return 200 with fallback instead of error
  }
}

/**
 * Build comprehensive resume context for AI analysis
 */
function buildResumeContext(resume: Resume): string {
  const sections: string[] = [];

  // Personal Info
  sections.push(`**Personal Information:**
- Name: ${resume.personalInfo.fullName}
- Title: ${resume.personalInfo.title || 'Not specified'}
- Contact: ${resume.personalInfo.email}, ${resume.personalInfo.phone}
- Location: ${resume.personalInfo.location || 'Not specified'}
- LinkedIn: ${resume.personalInfo.linkedin || 'Not provided'}
- Website: ${resume.personalInfo.website || 'Not provided'}`);

  // Summary
  sections.push(`\n**Professional Summary:**
${resume.summary || 'No summary provided'}`);

  // Skills
  sections.push(`\n**Skills (${resume.skills.length}):**
${resume.skills.join(', ') || 'No skills listed'}`);

  // Experience
  sections.push(`\n**Work Experience (${resume.experience.length} roles):**`);
  resume.experience.forEach((exp, idx) => {
    sections.push(`${idx + 1}. ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})
   - Description: ${exp.description}
   - Achievements (${exp.achievements.length}): ${exp.achievements.join('; ') || 'None listed'}`);
  });

  // Education
  sections.push(`\n**Education (${resume.education.length}):**`);
  resume.education.forEach((edu, idx) => {
    sections.push(`${idx + 1}. ${edu.degree} in ${edu.field} from ${edu.school} (${edu.startDate} - ${edu.endDate})
   - GPA: ${edu.gpa || 'Not specified'}`);
  });

  // Projects
  if (resume.projects && resume.projects.length > 0) {
    sections.push(`\n**Projects (${resume.projects.length}):**`);
    resume.projects.forEach((proj, idx) => {
      sections.push(`${idx + 1}. ${proj.name}
   - Technologies: ${proj.technologies.join(', ')}
   - Description: ${proj.description}
   - Highlights: ${proj.highlights.join('; ')}`);
    });
  } else {
    sections.push('\n**Projects:** None listed');
  }

  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    sections.push(`\n**Certifications (${resume.certifications.length}):**
${resume.certifications.map(cert => `- ${cert.name} from ${cert.issuer} (${cert.date})`).join('\n')}`);
  } else {
    sections.push('\n**Certifications:** None listed');
  }

  // Languages
  if (resume.languages && resume.languages.length > 0) {
    sections.push(`\n**Languages (${resume.languages.length}):**
${resume.languages.map(lang => `- ${lang.language} (${lang.proficiency})`).join('\n')}`);
  } else {
    sections.push('\n**Languages:** None listed');
  }

  // Links
  if (resume.links && resume.links.length > 0) {
    sections.push(`\n**Professional Links (${resume.links.length}):**
${resume.links.map(link => `- ${link.platform}: ${link.url}`).join('\n')}`);
  } else {
    sections.push('\n**Professional Links:** None provided');
  }

  return sections.join('\n');
}

/**
 * Generic fallback suggestions when AI fails
 */
function getGenericSuggestions(resume: Resume) {
  const suggestions = [];

  // Check summary
  if (!resume.summary || resume.summary.length < 60) {
    suggestions.push({
      type: 'content',
      title: 'Strengthen your professional summary',
      description: 'Write a compelling 2-3 sentence summary highlighting your expertise, years of experience, and unique value proposition. Aim for 100-150 characters.',
      impact: 'high',
    });
  }

  // Check quantified achievements
  const hasQuantified = resume.experience.some(exp =>
    exp.achievements.some(a => /\d+%|\d+\s?(people|users|customers|sales)|\b\d+\b/.test(a))
  );
  if (!hasQuantified) {
    suggestions.push({
      type: 'improvement',
      title: 'Add quantifiable achievements',
      description: 'Include numbers, percentages, or metrics to demonstrate measurable impact (e.g., "Increased team efficiency by 40%", "Managed team of 12 engineers")',
      impact: 'high',
    });
  }

  // Check skills count
  if (resume.skills.length < 8) {
    suggestions.push({
      type: 'keyword',
      title: 'Expand technical skills section',
      description: 'Add more relevant skills including frameworks, tools, and methodologies. Aim for 10-15 skills to improve ATS matching.',
      impact: 'medium',
      keywords: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker'],
    });
  }

  // Check projects
  if (!resume.projects || resume.projects.length === 0) {
    suggestions.push({
      type: 'content',
      title: 'Showcase your key projects',
      description: 'Add 2-3 significant projects that demonstrate your technical abilities and problem-solving skills. Include technologies used and measurable outcomes.',
      impact: 'medium',
    });
  }

  // Check professional links
  if (!resume.links || resume.links.length === 0) {
    suggestions.push({
      type: 'improvement',
      title: 'Add professional profile links',
      description: 'Include your LinkedIn profile and GitHub portfolio to provide recruiters with additional context about your work and professional network.',
      impact: 'medium',
    });
  }

  // Check certifications
  if (!resume.certifications || resume.certifications.length === 0) {
    suggestions.push({
      type: 'improvement',
      title: 'Consider adding certifications',
      description: 'Professional certifications from AWS, Google Cloud, Microsoft, or relevant industry bodies can significantly boost your credibility.',
      impact: 'low',
    });
  }

  return suggestions.slice(0, 6); // Return top 6 suggestions
}
