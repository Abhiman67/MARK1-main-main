import React from 'react';
import { Badge } from '@/components/ui/badge';

// Template Types
export type TemplateType = 'modern' | 'classic' | 'creative' | 'executive' | 'academic' | 'technical';

// Theme Customization Interface
export interface ThemeCustomization {
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  sectionSpacing: number;
  margins: number;
}

// Resume Data Interface
export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
  };
  summary: string;
  skills: string[];
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }>;
  projects?: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    link?: string;
    startDate: string;
    endDate: string;
    current: boolean;
    highlights: string[];
  }>;
  certifications?: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
    link?: string;
  }>;
  languages?: Array<{
    id: string;
    name: string;
    proficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';
  }>;
  links?: Array<{
    id: string;
    type: 'GitHub' | 'LinkedIn' | 'Portfolio' | 'Website' | 'Other';
    url: string;
    label?: string;
  }>;
  awards?: Array<{
    id: string;
    title: string;
    issuer: string;
    date: string;
    description: string;
  }>;
  volunteer?: Array<{
    id: string;
    organization: string;
    role: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
}

interface TemplateProps {
  resume: ResumeData;
  template: TemplateType;
  theme?: ThemeCustomization;
}

const defaultTheme: ThemeCustomization = {
  primaryColor: '#3B82F6',
  accentColor: '#8B5CF6',
  fontFamily: 'Inter',
  fontSize: 14,
  lineHeight: 1.6,
  sectionSpacing: 24,
  margins: 48,
};

// Modern Template - Clean, minimal, accent color
export const ModernTemplate: React.FC<TemplateProps> = ({ resume, theme = defaultTheme }) => {
  const formatDate = (date: string) => {
    if (!date) return '';
    return new Date(date + '-01').toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div 
      className="bg-white text-gray-900 max-w-[850px] mx-auto" 
      id="resume-preview"
      style={{
        padding: `${theme.margins}px`,
        fontFamily: theme.fontFamily,
        fontSize: `${theme.fontSize}px`,
        lineHeight: theme.lineHeight,
      }}
    >
      {/* Header with accent bar */}
      <div 
        className="pl-6"
        style={{ 
          borderLeft: `4px solid ${theme.primaryColor}`,
          marginBottom: `${theme.sectionSpacing}px`
        }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-1">
          {resume.personalInfo.fullName || 'Your Name'}
        </h1>
        <p 
          className="text-xl font-medium mb-3"
          style={{ color: theme.primaryColor }}
        >
          {resume.personalInfo.title || 'Your Title'}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {resume.personalInfo.email && (
            <span>✉ {resume.personalInfo.email}</span>
          )}
          {resume.personalInfo.phone && (
            <span>📞 {resume.personalInfo.phone}</span>
          )}
          {resume.personalInfo.location && (
            <span>📍 {resume.personalInfo.location}</span>
          )}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div style={{ marginBottom: `${theme.sectionSpacing}px` }}>
          <h2 
            className="text-lg font-bold uppercase tracking-wide mb-3 pb-2 border-b-2"
            style={{ 
              color: theme.primaryColor,
              borderColor: `${theme.primaryColor}33`
            }}
          >
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{resume.summary}</p>
        </div>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <div style={{ marginBottom: `${theme.sectionSpacing}px` }}>
          <h2 
            className="text-lg font-bold uppercase tracking-wide mb-3 pb-2 border-b-2"
            style={{ 
              color: theme.primaryColor,
              borderColor: `${theme.primaryColor}33`
            }}
          >
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-sm font-medium rounded-full"
                style={{
                  backgroundColor: `${theme.primaryColor}15`,
                  color: theme.primaryColor
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-blue-600 uppercase tracking-wide mb-3 pb-2 border-b-2 border-blue-200">
            Experience
          </h2>
          <div className="space-y-6">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{exp.position || 'Position'}</h3>
                    <p className="text-blue-600 font-medium">{exp.company || 'Company'}</p>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(exp.startDate) || 'Start'} -{' '}
                    {exp.current ? 'Present' : formatDate(exp.endDate) || 'End'}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-gray-700 text-sm mb-2">{exp.description}</p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="space-y-1">
                    {exp.achievements.map((ach, idx) => (
                      <li key={idx} className="text-gray-700 text-sm flex items-start">
                        <span className="text-blue-600 mr-2">▸</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-blue-600 uppercase tracking-wide mb-3 pb-2 border-b-2 border-blue-200">
            Education
          </h2>
          <div className="space-y-4">
            {resume.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">
                    {edu.degree || 'Degree'} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-gray-700">{edu.institution || 'Institution'}</p>
                  {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  {formatDate(edu.startDate) || 'Start'} -{' '}
                  {formatDate(edu.endDate) || 'End'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-blue-600 uppercase tracking-wide mb-3 pb-2 border-b-2 border-blue-200">
            Projects
          </h2>
          <div className="space-y-6">
            {resume.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                    {project.link && (
                      <a href={project.link} className="text-blue-600 text-sm hover:underline" target="_blank" rel="noopener noreferrer">
                        {project.link}
                      </a>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(project.startDate)} -{' '}
                    {project.current ? 'Present' : formatDate(project.endDate)}
                  </span>
                </div>
                <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {project.highlights.length > 0 && (
                  <ul className="space-y-1">
                    {project.highlights.map((highlight, idx) => (
                      <li key={idx} className="text-gray-700 text-sm flex items-start">
                        <span className="text-blue-600 mr-2">▸</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-blue-600 uppercase tracking-wide mb-3 pb-2 border-b-2 border-blue-200">
            Certifications
          </h2>
          <div className="space-y-4">
            {resume.certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{cert.name}</h3>
                  <p className="text-gray-700">{cert.issuer}</p>
                  {cert.credentialId && (
                    <p className="text-sm text-gray-600">ID: {cert.credentialId}</p>
                  )}
                  {cert.link && (
                    <a href={cert.link} className="text-blue-600 text-sm hover:underline" target="_blank" rel="noopener noreferrer">
                      Verify
                    </a>
                  )}
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{formatDate(cert.date)}</p>
                  {cert.expiryDate && <p className="text-xs">Expires: {formatDate(cert.expiryDate)}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {resume.languages && resume.languages.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-blue-600 uppercase tracking-wide mb-3 pb-2 border-b-2 border-blue-200">
            Languages
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {resume.languages.map((lang) => (
              <div key={lang.id} className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{lang.name}</span>
                <span className="text-sm text-gray-600">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio Links */}
      {resume.links && resume.links.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-blue-600 uppercase tracking-wide mb-3 pb-2 border-b-2 border-blue-200">
            Links
          </h2>
          <div className="space-y-2">
            {resume.links.map((link) => (
              <div key={link.id} className="flex items-center">
                <span className="text-sm text-gray-600 w-24">{link.type}:</span>
                <a href={link.url} className="text-blue-600 text-sm hover:underline" target="_blank" rel="noopener noreferrer">
                  {link.label || link.url}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Awards & Honors */}
      {resume.awards && resume.awards.length > 0 && (
        <div className="mb-8">
          <h2 
            className="text-lg font-bold uppercase tracking-wide mb-3 pb-2 border-b-2" 
            style={{ 
              color: theme.primaryColor,
              borderColor: `${theme.primaryColor}33`,
              marginBottom: `${theme.sectionSpacing}px`
            }}
          >
            Awards & Honors
          </h2>
          <div className="space-y-4">
            {resume.awards.map((award) => (
              <div key={award.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900">{award.title}</h3>
                  <span className="text-sm text-gray-500">{formatDate(award.date)}</span>
                </div>
                <p className="text-gray-700 font-medium">{award.issuer}</p>
                {award.description && (
                  <p className="text-sm text-gray-600 mt-1">{award.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Volunteer Experience */}
      {resume.volunteer && resume.volunteer.length > 0 && (
        <div className="mb-8">
          <h2 
            className="text-lg font-bold uppercase tracking-wide mb-3 pb-2 border-b-2" 
            style={{ 
              color: theme.primaryColor,
              borderColor: `${theme.primaryColor}33`,
              marginBottom: `${theme.sectionSpacing}px`
            }}
          >
            Volunteer Experience
          </h2>
          <div className="space-y-6">
            {resume.volunteer.map((vol) => (
              <div key={vol.id}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900">{vol.role}</h3>
                    <p className="text-gray-700">{vol.organization}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {formatDate(vol.startDate)} - {vol.current ? 'Present' : formatDate(vol.endDate)}
                  </div>
                </div>
                {vol.description && <p className="text-sm text-gray-600 mt-2">{vol.description}</p>}
                {vol.achievements.length > 0 && (
                  <ul className="space-y-1 mt-2">
                    {vol.achievements.map((achievement, idx) => (
                      <li key={idx} className="text-gray-700 text-sm flex items-start">
                        <span style={{ color: theme.accentColor }} className="mr-2">▸</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Classic Template - Traditional serif, formal
export const ClassicTemplate: React.FC<TemplateProps> = ({ resume, theme = defaultTheme }) => {
  const formatDate = (date: string) => {
    if (!date) return '';
    return new Date(date + '-01').toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div 
      className="bg-white text-gray-900 max-w-[850px] mx-auto font-serif" 
      id="resume-preview"
      style={{
        padding: `${theme.margins}px`,
        fontFamily: theme.fontFamily === 'Georgia' ? 'Georgia, serif' : theme.fontFamily,
        fontSize: `${theme.fontSize}px`,
        lineHeight: theme.lineHeight,
      }}
    >
      {/* Header - Centered */}
      <div 
        className="text-center pb-6 border-b-2"
        style={{ 
          borderColor: theme.primaryColor,
          marginBottom: `${theme.sectionSpacing}px`
        }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-wide uppercase">
          {resume.personalInfo.fullName || 'Your Name'}
        </h1>
        <p 
          className="text-lg mb-3 italic"
          style={{ color: theme.primaryColor }}
        >
          {resume.personalInfo.title || 'Your Title'}
        </p>
        <div className="text-sm text-gray-600 space-x-3">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>•</span>}
          {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>•</span>}
          {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div style={{ marginBottom: `${theme.sectionSpacing}px` }}>
          <h2 
            className="text-base font-bold uppercase mb-3 border-b pb-1"
            style={{ 
              color: theme.primaryColor,
              borderColor: `${theme.primaryColor}66`
            }}
          >
            Objective
          </h2>
          <p className="text-gray-800 text-sm leading-relaxed text-justify">{resume.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <div style={{ marginBottom: `${theme.sectionSpacing}px` }}>
          <h2 
            className="text-base font-bold uppercase mb-3 border-b pb-1"
            style={{ 
              color: theme.primaryColor,
              borderColor: `${theme.primaryColor}66`
            }}
          >
            Professional Experience
          </h2>
          <div className="space-y-4">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900">{exp.position || 'Position'}</h3>
                  <span className="text-xs text-gray-600 italic whitespace-nowrap ml-4">
                    {formatDate(exp.startDate) || 'Start'} -{' '}
                    {exp.current ? 'Present' : formatDate(exp.endDate) || 'End'}
                  </span>
                </div>
                <p className="text-sm text-gray-700 italic mb-2">{exp.company || 'Company'}</p>
                {exp.description && (
                  <p className="text-xs text-gray-700 mb-2">{exp.description}</p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    {exp.achievements.map((ach, idx) => (
                      <li key={idx} className="text-xs text-gray-700">
                        {ach}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div style={{ marginBottom: `${theme.sectionSpacing}px` }}>
          <h2 
            className="text-base font-bold uppercase mb-3 border-b pb-1"
            style={{ 
              color: theme.primaryColor,
              borderColor: `${theme.primaryColor}66`
            }}
          >
            Education
          </h2>
          <div className="space-y-3">
            {resume.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      {edu.degree || 'Degree'} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-sm text-gray-700 italic">{edu.institution || 'Institution'}</p>
                    {edu.gpa && <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-xs text-gray-600 italic whitespace-nowrap">
                    {formatDate(edu.startDate) || 'Start'} - {formatDate(edu.endDate) || 'End'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <div style={{ marginBottom: `${theme.sectionSpacing}px` }}>
          <h2 
            className="text-base font-bold uppercase mb-3 border-b pb-1"
            style={{ 
              color: theme.primaryColor,
              borderColor: `${theme.primaryColor}66`
            }}
          >
            Skills
          </h2>
          <p className="text-xs text-gray-700">{resume.skills.join(' • ')}</p>
        </div>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 uppercase mb-3 border-b border-gray-400 pb-1">
            Projects
          </h2>
          <div className="space-y-4">
            {resume.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900 text-sm">{project.name}</h3>
                  <span className="text-xs text-gray-600 italic whitespace-nowrap ml-4">
                    {formatDate(project.startDate)} -{' '}
                    {project.current ? 'Present' : formatDate(project.endDate)}
                  </span>
                </div>
                <p className="text-xs text-gray-700 mb-2">{project.description}</p>
                {project.technologies.length > 0 && (
                  <p className="text-xs text-gray-600 italic mb-2">
                    {project.technologies.join(' • ')}
                  </p>
                )}
                {project.link && (
                  <a href={project.link} className="text-xs text-gray-700 underline" target="_blank" rel="noopener noreferrer">
                    {project.link}
                  </a>
                )}
                {project.highlights.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                    {project.highlights.map((highlight, idx) => (
                      <li key={idx} className="text-xs text-gray-700">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 uppercase mb-3 border-b border-gray-400 pb-1">
            Certifications
          </h2>
          <div className="space-y-3">
            {resume.certifications.map((cert) => (
              <div key={cert.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{cert.name}</h3>
                    <p className="text-sm text-gray-700 italic">{cert.issuer}</p>
                    {cert.credentialId && (
                      <p className="text-xs text-gray-600">ID: {cert.credentialId}</p>
                    )}
                    {cert.link && (
                      <a href={cert.link} className="text-xs text-gray-700 underline" target="_blank" rel="noopener noreferrer">
                        Verify Credential
                      </a>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-600 italic whitespace-nowrap">
                      {formatDate(cert.date)}
                    </span>
                    {cert.expiryDate && (
                      <p className="text-xs text-gray-500">Expires: {formatDate(cert.expiryDate)}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {resume.languages && resume.languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 uppercase mb-3 border-b border-gray-400 pb-1">
            Languages
          </h2>
          <div className="space-y-2">
            {resume.languages.map((lang) => (
              <div key={lang.id} className="flex justify-between items-center">
                <span className="text-sm text-gray-900">{lang.name}</span>
                <span className="text-xs text-gray-600 italic">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio Links */}
      {resume.links && resume.links.length > 0 && (
        <div style={{ marginBottom: `${theme.sectionSpacing}px` }}>
          <h2 
            className="text-base font-bold uppercase mb-3 border-b pb-1"
            style={{ 
              color: theme.primaryColor,
              borderColor: `${theme.primaryColor}66`
            }}
          >
            Professional Links
          </h2>
          <div className="space-y-1">
            {resume.links.map((link) => (
              <div key={link.id}>
                <span className="text-xs text-gray-600 uppercase">{link.type}:</span>{' '}
                <a href={link.url} className="text-xs text-gray-700 underline" target="_blank" rel="noopener noreferrer">
                  {link.label || link.url}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Awards & Honors */}
      {resume.awards && resume.awards.length > 0 && (
        <div style={{ marginBottom: `${theme.sectionSpacing}px` }}>
          <h2 
            className="text-base font-bold uppercase mb-3 border-b pb-1"
            style={{ 
              color: theme.primaryColor,
              borderColor: `${theme.primaryColor}66`
            }}
          >
            Awards & Honors
          </h2>
          <div className="space-y-3">
            {resume.awards.map((award) => (
              <div key={award.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900 text-sm">{award.title}</h3>
                  <span className="text-xs text-gray-600 italic whitespace-nowrap ml-4">
                    {formatDate(award.date)}
                  </span>
                </div>
                <p className="text-xs text-gray-700 italic">{award.issuer}</p>
                {award.description && (
                  <p className="text-xs text-gray-600 mt-1">{award.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Volunteer Experience */}
      {resume.volunteer && resume.volunteer.length > 0 && (
        <div style={{ marginBottom: `${theme.sectionSpacing}px` }}>
          <h2 
            className="text-base font-bold uppercase mb-3 border-b pb-1"
            style={{ 
              color: theme.primaryColor,
              borderColor: `${theme.primaryColor}66`
            }}
          >
            Volunteer Experience
          </h2>
          <div className="space-y-4">
            {resume.volunteer.map((vol) => (
              <div key={vol.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{vol.role}</h3>
                    <p className="text-xs text-gray-700 italic">{vol.organization}</p>
                  </div>
                  <span className="text-xs text-gray-600 italic whitespace-nowrap ml-4">
                    {formatDate(vol.startDate)} - {vol.current ? 'Present' : formatDate(vol.endDate)}
                  </span>
                </div>
                {vol.description && <p className="text-xs text-gray-600 mt-1">{vol.description}</p>}
                {vol.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                    {vol.achievements.map((achievement, idx) => (
                      <li key={idx} className="text-xs text-gray-700">
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Creative Template - Bold, colorful, two-column
export const CreativeTemplate: React.FC<TemplateProps> = ({ resume, theme = defaultTheme }) => {
  const formatDate = (date: string) => {
    if (!date) return '';
    return new Date(date + '-01').toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div 
      className="bg-white text-gray-900 max-w-[850px] mx-auto flex" 
      id="resume-preview"
      style={{
        fontFamily: theme.fontFamily,
        fontSize: `${theme.fontSize}px`,
        lineHeight: theme.lineHeight,
      }}
    >
      {/* Left Sidebar */}
      <div 
        className="w-1/3 text-white"
        style={{ 
          background: `linear-gradient(to bottom, ${theme.accentColor}, ${theme.accentColor}dd)`,
          padding: `${theme.margins}px`
        }}
      >
        <div style={{ marginBottom: `${theme.sectionSpacing}px` }}>
          <div 
            className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold"
            style={{ color: theme.accentColor }}
          >
            {resume.personalInfo.fullName?.charAt(0) || 'Y'}
          </div>
          <h2 
            className="text-sm font-bold uppercase tracking-wider mb-4"
            style={{ color: `${theme.accentColor}22` }}
          >
            Contact
          </h2>
          <div className="space-y-2 text-sm">
            {resume.personalInfo.email && (
              <p className="break-words">{resume.personalInfo.email}</p>
            )}
            {resume.personalInfo.phone && <p>{resume.personalInfo.phone}</p>}
            {resume.personalInfo.location && <p>{resume.personalInfo.location}</p>}
          </div>
        </div>

        {/* Skills */}
        {resume.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-purple-200">
              Skills
            </h2>
            <div className="space-y-2">
              {resume.skills.map((skill, idx) => (
                <div key={idx} className="text-sm">
                  <p className="mb-1">{skill}</p>
                  <div className="h-1 bg-purple-400 rounded-full w-full"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-purple-200">
              Education
            </h2>
            <div className="space-y-4">
              {resume.education.map((edu) => (
                <div key={edu.id} className="text-sm">
                  <p className="font-bold">{edu.degree || 'Degree'}</p>
                  <p className="text-purple-200 text-xs">{edu.institution || 'Institution'}</p>
                  <p className="text-purple-300 text-xs">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                  {edu.gpa && <p className="text-xs text-purple-200">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {resume.languages && resume.languages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-purple-200">
              Languages
            </h2>
            <div className="space-y-3">
              {resume.languages.map((lang) => (
                <div key={lang.id} className="text-sm">
                  <p className="font-medium mb-1">{lang.name}</p>
                  <p className="text-xs text-purple-200">{lang.proficiency}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio Links */}
        {resume.links && resume.links.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-purple-200">
              Links
            </h2>
            <div className="space-y-2">
              {resume.links.map((link) => (
                <div key={link.id} className="text-xs">
                  <p className="text-purple-200 uppercase mb-1">{link.type}</p>
                  <a href={link.url} className="hover:underline break-words" target="_blank" rel="noopener noreferrer">
                    {link.label || link.url}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div 
        className="w-2/3"
        style={{ padding: `${theme.margins}px` }}
      >
        {/* Header */}
        <div style={{ marginBottom: `${theme.sectionSpacing}px` }}>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {resume.personalInfo.fullName || 'Your Name'}
          </h1>
          <p 
            className="text-xl font-semibold"
            style={{ color: theme.primaryColor }}
          >
            {resume.personalInfo.title || 'Your Title'}
          </p>
        </div>

        {/* Summary */}
        {resume.summary && (
          <div style={{ marginBottom: `${theme.sectionSpacing}px` }}>
            <h2 
              className="text-lg font-bold mb-3 flex items-center"
              style={{ color: theme.primaryColor }}
            >
              <span 
                className="w-2 h-6 mr-3"
                style={{ backgroundColor: theme.primaryColor }}
              ></span>
              About Me
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">{resume.summary}</p>
          </div>
        )}

        {/* Experience */}
        {resume.experience.length > 0 && (
          <div style={{ marginBottom: `${theme.sectionSpacing}px` }}>
            <h2 
              className="text-lg font-bold mb-4 flex items-center"
              style={{ color: theme.primaryColor }}
            >
              <span 
                className="w-2 h-6 mr-3"
                style={{ backgroundColor: theme.primaryColor }}
              ></span>
              Experience
            </h2>
            <div className="space-y-6">
              {resume.experience.map((exp) => (
                <div 
                  key={exp.id} 
                  className="relative pl-6 border-l-2"
                  style={{ borderColor: `${theme.primaryColor}44` }}
                >
                  <div 
                    className="absolute -left-2 top-0 w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.primaryColor }}
                  ></div>
                  <h3 className="text-base font-bold text-gray-900">{exp.position || 'Position'}</h3>
                  <p 
                    className="font-medium text-sm mb-1"
                    style={{ color: theme.primaryColor }}
                  >
                    {exp.company || 'Company'}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    {formatDate(exp.startDate) || 'Start'} -{' '}
                    {exp.current ? 'Present' : formatDate(exp.endDate) || 'End'}
                  </p>
                  {exp.description && (
                    <p className="text-gray-700 text-xs mb-2">{exp.description}</p>
                  )}
                  {exp.achievements.length > 0 && (
                    <ul className="space-y-1">
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx} className="text-gray-700 text-xs flex items-start">
                          <span className="text-purple-600 mr-2">✓</span>
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-purple-600 mb-4 flex items-center">
              <span className="w-2 h-6 bg-purple-600 mr-3"></span>
              Projects
            </h2>
            <div className="space-y-6">
              {resume.projects.map((project) => (
                <div key={project.id} className="relative pl-6 border-l-2 border-purple-300">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-purple-600 rounded-full"></div>
                  <h3 className="text-base font-bold text-gray-900">{project.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {formatDate(project.startDate)} -{' '}
                    {project.current ? 'Present' : formatDate(project.endDate)}
                  </p>
                  <p className="text-gray-700 text-xs mb-2">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.link && (
                    <a href={project.link} className="text-purple-600 text-xs hover:underline mb-2 block" target="_blank" rel="noopener noreferrer">
                      {project.link}
                    </a>
                  )}
                  {project.highlights.length > 0 && (
                    <ul className="space-y-1">
                      {project.highlights.map((highlight, idx) => (
                        <li key={idx} className="text-gray-700 text-xs flex items-start">
                          <span className="text-purple-600 mr-2">✓</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {resume.certifications && resume.certifications.length > 0 && (
          <div className="mb-8">
            <h2 
              className="text-lg font-bold mb-4 flex items-center"
              style={{ color: theme.primaryColor }}
            >
              <span 
                className="w-2 h-6 mr-3"
                style={{ backgroundColor: theme.primaryColor }}
              ></span>
              Certifications
            </h2>
            <div className="space-y-4">
              {resume.certifications.map((cert) => (
                <div 
                  key={cert.id} 
                  className="pl-6 border-l-2"
                  style={{ borderColor: `${theme.primaryColor}66` }}
                >
                  <h3 className="text-base font-bold text-gray-900">{cert.name}</h3>
                  <p style={{ color: theme.primaryColor }} className="text-sm">{cert.issuer}</p>
                  <p className="text-xs text-gray-500 mb-1">
                    {formatDate(cert.date)}
                    {cert.expiryDate && ` - Expires: ${formatDate(cert.expiryDate)}`}
                  </p>
                  {cert.credentialId && (
                    <p className="text-xs text-gray-600">ID: {cert.credentialId}</p>
                  )}
                  {cert.link && (
                    <a 
                      href={cert.link} 
                      className="text-xs hover:underline" 
                      style={{ color: theme.primaryColor }}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Verify Credential
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards & Honors */}
        {resume.awards && resume.awards.length > 0 && (
          <div className="mb-8">
            <h2 
              className="text-lg font-bold mb-4 flex items-center"
              style={{ color: theme.primaryColor }}
            >
              <span 
                className="w-2 h-6 mr-3"
                style={{ backgroundColor: theme.primaryColor }}
              ></span>
              Awards & Honors
            </h2>
            <div className="space-y-4">
              {resume.awards.map((award) => (
                <div 
                  key={award.id} 
                  className="pl-6 border-l-2"
                  style={{ borderColor: `${theme.primaryColor}66` }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-bold text-gray-900">{award.title}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {formatDate(award.date)}
                    </span>
                  </div>
                  <p style={{ color: theme.primaryColor }} className="text-sm">{award.issuer}</p>
                  {award.description && (
                    <p className="text-xs text-gray-600 mt-1">{award.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Volunteer Experience */}
        {resume.volunteer && resume.volunteer.length > 0 && (
          <div className="mb-8">
            <h2 
              className="text-lg font-bold mb-4 flex items-center"
              style={{ color: theme.primaryColor }}
            >
              <span 
                className="w-2 h-6 mr-3"
                style={{ backgroundColor: theme.primaryColor }}
              ></span>
              Volunteer Experience
            </h2>
            <div className="space-y-6">
              {resume.volunteer.map((vol) => (
                <div 
                  key={vol.id} 
                  className="relative pl-6 border-l-2"
                  style={{ borderColor: `${theme.primaryColor}66` }}
                >
                  <div 
                    className="absolute -left-2 top-0 w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.primaryColor }}
                  ></div>
                  <h3 className="text-base font-bold text-gray-900">{vol.role}</h3>
                  <p style={{ color: theme.primaryColor }} className="text-sm">
                    {vol.organization}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    {formatDate(vol.startDate)} - {vol.current ? 'Present' : formatDate(vol.endDate)}
                  </p>
                  {vol.description && (
                    <p className="text-gray-700 text-xs mb-2">{vol.description}</p>
                  )}
                  {vol.achievements.length > 0 && (
                    <ul className="space-y-1">
                      {vol.achievements.map((ach, idx) => (
                        <li key={idx} className="text-gray-700 text-xs flex items-start">
                          <span style={{ color: theme.accentColor }} className="mr-2">✓</span>
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Executive Template - Sophisticated, formal, for senior leadership
export const ExecutiveTemplate: React.FC<TemplateProps> = ({ resume, theme = defaultTheme }) => {
  const formatDate = (date: string) => {
    if (!date) return '';
    try {
      return new Date(date + '-01').toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return date;
    }
  };

  return (
    <div 
      className="bg-white text-gray-900 max-w-[850px] mx-auto" 
      id="resume-preview"
      style={{
        padding: `${theme.margins}px`,
        fontFamily: "'Georgia', serif",
        fontSize: `${theme.fontSize}px`,
        lineHeight: theme.lineHeight,
      }}
    >
      {/* Executive Header - Centered, elegant */}
      <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
        <h1 className="text-5xl font-serif font-bold text-gray-900 mb-2">
          {resume.personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-xl font-semibold text-gray-700 mb-3">
          {resume.personalInfo.title || 'Executive Leadership'}
        </p>
        <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-600">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>•</span>}
          {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>•</span>}
          {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
        </div>
      </div>

      {/* Executive Summary */}
      {resume.summary && (
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3 text-center uppercase tracking-wider">
            Executive Profile
          </h2>
          <p className="text-gray-800 text-base leading-relaxed text-justify">{resume.summary}</p>
        </div>
      )}

      {/* Core Competencies */}
      {resume.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 text-center uppercase tracking-wider">
            Core Competencies
          </h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            {resume.skills.map((skill, idx) => (
              <div key={idx} className="py-2 px-3 border border-gray-300 rounded">
                <span className="text-sm font-medium text-gray-800">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {resume.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 text-center uppercase tracking-wider border-b-2 border-gray-800 pb-2">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-base font-semibold text-gray-700">{exp.company}</p>
                  </div>
                  <p className="text-sm text-gray-600 text-right whitespace-nowrap ml-4">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </p>
                </div>
                {exp.description && (
                  <p className="text-gray-700 text-sm mb-2 italic">{exp.description}</p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="space-y-1.5">
                    {exp.achievements.map((ach, idx) => (
                      <li key={idx} className="text-gray-800 text-sm flex items-start">
                        <span className="mr-2 text-gray-600">▪</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 text-center uppercase tracking-wider border-b-2 border-gray-800 pb-2">
            Education
          </h2>
          <div className="space-y-3">
            {resume.education.map((edu) => (
              <div key={edu.id} className="flex justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{edu.degree} in {edu.field}</h3>
                  <p className="text-sm text-gray-700">{edu.institution}</p>
                </div>
                <p className="text-sm text-gray-600">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Academic Template - Perfect for research, publications, academic positions
export const AcademicTemplate: React.FC<TemplateProps> = ({ resume, theme = defaultTheme }) => {
  const formatDate = (date: string) => {
    if (!date) return '';
    try {
      return new Date(date + '-01').toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return date;
    }
  };

  return (
    <div 
      className="bg-white text-gray-900 max-w-[850px] mx-auto" 
      id="resume-preview"
      style={{
        padding: `${theme.margins}px`,
        fontFamily: "'Times New Roman', serif",
        fontSize: `${theme.fontSize}px`,
        lineHeight: 1.5,
      }}
    >
      {/* Academic Header */}
      <div className="border-b border-gray-400 pb-4 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-1">
          {resume.personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-lg text-gray-700 mb-2">
          {resume.personalInfo.title || 'Academic Position'}
        </p>
        <div className="text-sm text-gray-600 space-y-0.5">
          {resume.personalInfo.email && <div>Email: {resume.personalInfo.email}</div>}
          {resume.personalInfo.phone && <div>Phone: {resume.personalInfo.phone}</div>}
          {resume.personalInfo.location && <div>Address: {resume.personalInfo.location}</div>}
        </div>
      </div>

      {/* Research Interests / Summary */}
      {resume.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase">Research Interests</h2>
          <p className="text-gray-800 text-sm">{resume.summary}</p>
        </div>
      )}

      {/* Education - Prominent in academic CVs */}
      {resume.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase border-b border-gray-300 pb-1">
            Education
          </h2>
          <div className="space-y-3">
            {resume.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      {edu.degree}, {edu.field}
                    </h3>
                    <p className="text-sm text-gray-700">{edu.institution}</p>
                    {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Academic Experience / Positions */}
      {resume.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase border-b border-gray-300 pb-1">
            Academic Positions
          </h2>
          <div className="space-y-4">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-sm text-gray-700">{exp.company}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </p>
                </div>
                {exp.description && (
                  <p className="text-gray-700 text-sm mb-1">{exp.description}</p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="space-y-0.5 ml-4">
                    {exp.achievements.map((ach, idx) => (
                      <li key={idx} className="text-gray-800 text-sm list-disc">
                        {ach}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Research Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase border-b border-gray-300 pb-1">
            Research Projects
          </h2>
          <div className="space-y-3">
            {resume.projects.map((proj) => (
              <div key={proj.id}>
                <h3 className="text-base font-semibold text-gray-900">{proj.name}</h3>
                <p className="text-sm text-gray-700">{proj.description}</p>
                {proj.link && (
                  <p className="text-xs text-blue-600 mt-1">{proj.link}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills / Technical Proficiencies */}
      {resume.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase border-b border-gray-300 pb-1">
            Technical Skills
          </h2>
          <p className="text-sm text-gray-800">{resume.skills.join(', ')}</p>
        </div>
      )}

      {/* Certifications / Awards */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase border-b border-gray-300 pb-1">
            Honors & Awards
          </h2>
          <div className="space-y-2">
            {resume.certifications.map((cert) => (
              <div key={cert.id}>
                <h3 className="text-sm font-semibold text-gray-900">{cert.name}</h3>
                <p className="text-xs text-gray-700">{cert.issuer}, {cert.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Technical Template - Optimized for developers and engineers
export const TechnicalTemplate: React.FC<TemplateProps> = ({ resume, theme = defaultTheme }) => {
  const formatDate = (date: string) => {
    if (!date) return '';
    try {
      return new Date(date + '-01').toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return date;
    }
  };

  return (
    <div 
      className="bg-gray-50 text-gray-900 max-w-[850px] mx-auto" 
      id="resume-preview"
      style={{
        padding: `${theme.margins}px`,
        fontFamily: "'Fira Code', 'Monaco', monospace",
        fontSize: `${theme.fontSize}px`,
        lineHeight: theme.lineHeight,
      }}
    >
      {/* Tech Header - Command line style */}
      <div className="bg-gray-900 text-green-400 p-6 rounded-lg mb-6 font-mono">
        <div className="mb-2">
          <span className="text-gray-500">$</span> <span className="text-cyan-400">whoami</span>
        </div>
        <h1 className="text-3xl font-bold mb-1">
          {resume.personalInfo.fullName || 'developer'}
        </h1>
        <p className="text-lg text-green-300 mb-3">
          {resume.personalInfo.title || 'Full Stack Developer'}
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          {resume.personalInfo.email && (
            <span><span className="text-gray-500">email:</span> {resume.personalInfo.email}</span>
          )}
          {resume.personalInfo.phone && (
            <span><span className="text-gray-500">phone:</span> {resume.personalInfo.phone}</span>
          )}
          {resume.personalInfo.location && (
            <span><span className="text-gray-500">location:</span> {resume.personalInfo.location}</span>
          )}
        </div>
      </div>

      {/* About */}
      {resume.summary && (
        <div className="bg-white p-6 rounded-lg mb-6 border-l-4 border-cyan-500">
          <h2 className="text-xl font-bold text-gray-900 mb-3 font-mono">
            <span className="text-cyan-500">//</span> About
          </h2>
          <p className="text-gray-700">{resume.summary}</p>
        </div>
      )}

      {/* Tech Stack */}
      {resume.skills.length > 0 && (
        <div className="bg-white p-6 rounded-lg mb-6 border-l-4 border-green-500">
          <h2 className="text-xl font-bold text-gray-900 mb-3 font-mono">
            <span className="text-green-500">{'{'}</span> Tech Stack <span className="text-green-500">{'}'}</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 text-sm font-mono font-medium bg-gray-900 text-green-400 rounded border border-green-500"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects - Prominent for developers */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="bg-white p-6 rounded-lg mb-6 border-l-4 border-purple-500">
          <h2 className="text-xl font-bold text-gray-900 mb-4 font-mono">
            <span className="text-purple-500">{'<'}</span> Projects <span className="text-purple-500">{'/>'}</span>
          </h2>
          <div className="space-y-5">
            {resume.projects.map((proj) => (
              <div key={proj.id} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900 font-mono">{proj.name}</h3>
                  {proj.link && (
                    <a href={proj.link} className="text-xs text-cyan-600 hover:underline">
                      view →
                    </a>
                  )}
                </div>
                <p className="text-gray-700 text-sm mb-2">{proj.description}</p>
                {proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {proj.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-xs font-mono bg-gray-100 text-gray-700 rounded border border-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {proj.highlights.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {proj.highlights.map((highlight, idx) => (
                      <li key={idx} className="text-gray-700 text-sm flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {resume.experience.length > 0 && (
        <div className="bg-white p-6 rounded-lg mb-6 border-l-4 border-blue-500">
          <h2 className="text-xl font-bold text-gray-900 mb-4 font-mono">
            <span className="text-blue-500">{'['}</span> Experience <span className="text-blue-500">{']'}</span>
          </h2>
          <div className="space-y-5">
            {resume.experience.map((exp) => (
              <div key={exp.id} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-sm font-semibold text-cyan-600">{exp.company}</p>
                  </div>
                  <p className="text-xs text-gray-500 font-mono">
                    {formatDate(exp.startDate)} → {exp.current ? 'now' : formatDate(exp.endDate)}
                  </p>
                </div>
                {exp.description && (
                  <p className="text-gray-700 text-sm mb-2">{exp.description}</p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="space-y-1">
                    {exp.achievements.map((ach, idx) => (
                      <li key={idx} className="text-gray-700 text-sm flex items-start">
                        <span className="text-cyan-500 mr-2">▸</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="bg-white p-6 rounded-lg mb-6 border-l-4 border-yellow-500">
          <h2 className="text-xl font-bold text-gray-900 mb-3 font-mono">
            <span className="text-yellow-500">📚</span> Education
          </h2>
          <div className="space-y-3">
            {resume.education.map((edu) => (
              <div key={edu.id} className="flex justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{edu.degree}, {edu.field}</h3>
                  <p className="text-sm text-gray-700">{edu.institution}</p>
                </div>
                <p className="text-sm text-gray-600 font-mono">
                  {formatDate(edu.endDate)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {resume.links && resume.links.length > 0 && (
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
          <div className="flex flex-wrap gap-4">
            {resume.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                className="hover:text-cyan-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-gray-500">$</span> {link.type.toLowerCase()} <span className="text-cyan-400">→</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Template Renderer Component
export const ResumeTemplate: React.FC<TemplateProps> = ({ resume, template, theme }) => {
  switch (template) {
    case 'modern':
      return <ModernTemplate resume={resume} template={template} theme={theme} />;
    case 'classic':
      return <ClassicTemplate resume={resume} template={template} theme={theme} />;
    case 'creative':
      return <CreativeTemplate resume={resume} template={template} theme={theme} />;
    case 'executive':
      return <ExecutiveTemplate resume={resume} template={template} theme={theme} />;
    case 'academic':
      return <AcademicTemplate resume={resume} template={template} theme={theme} />;
    case 'technical':
      return <TechnicalTemplate resume={resume} template={template} theme={theme} />;
    default:
      return <ModernTemplate resume={resume} template={template} theme={theme} />;
  }
};
