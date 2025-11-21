"use client";

import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Resume } from '@/hooks/useATSScore';

interface ResumePreviewProps {
  resume: Resume | null;
  id?: string;
  className?: string;
}

export const ResumePreview = memo(function ResumePreview({ resume, id = 'resume-preview', className = '' }: ResumePreviewProps) {
  if (!resume) {
    return (
      <div className={`bg-white text-black p-8 rounded-lg shadow-lg min-h-[800px] flex items-center justify-center ${className}`}>
        <p className="text-gray-400">No resume selected</p>
      </div>
    );
  }

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`bg-white text-black p-8 rounded-lg shadow-lg ${className}`}
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* Header */}
      <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
        <h1 className="text-3xl font-bold mb-1">{resume.personalInfo.fullName}</h1>
        {resume.personalInfo.title && <p className="text-lg text-gray-700 mb-2">{resume.personalInfo.title}</p>}
        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>•</span>}
          {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>•</span>}
          {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
        </div>
      </div>

      {/* Links */}
      {resume.links && resume.links.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-gray-900 border-b border-gray-300">LINKS</h2>
          <div className="space-y-1">
            {resume.links.map((link, idx) => (
              <div key={idx} className="text-sm">
                <span className="font-medium">{link.platform}:</span>{' '}
                <a href={link.url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  {link.url}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {resume.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-gray-900 border-b border-gray-300">PROFESSIONAL SUMMARY</h2>
          <p className="text-sm leading-relaxed text-gray-800">{resume.summary}</p>
        </div>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-gray-900 border-b border-gray-300">SKILLS</h2>
          <p className="text-sm leading-relaxed text-gray-800">{resume.skills.join(' • ')}</p>
        </div>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-gray-900 border-b border-gray-300">EXPERIENCE</h2>
          <div className="space-y-4">
            {resume.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-sm">{exp.position}</h3>
                  <span className="text-xs text-gray-600">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-1">{exp.company}</p>
                {exp.description && <p className="text-sm text-gray-800 mb-2">{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                    {exp.achievements.map((ach, i) => (
                      <li key={i}>{ach}</li>
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
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-gray-900 border-b border-gray-300">PROJECTS</h2>
          <div className="space-y-4">
            {resume.projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-sm">{proj.name}</h3>
                  {(proj.startDate || proj.endDate) && (
                    <span className="text-xs text-gray-600">
                      {formatDate(proj.startDate)} - {proj.endDate ? formatDate(proj.endDate) : 'Present'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-800 mb-1">{proj.description}</p>
                {proj.technologies.length > 0 && (
                  <p className="text-xs text-gray-600 mb-2">
                    <span className="font-medium">Technologies:</span> {proj.technologies.join(', ')}
                  </p>
                )}
                {proj.url && (
                  <p className="text-xs mb-2">
                    <a href={proj.url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      {proj.url}
                    </a>
                  </p>
                )}
                {proj.highlights.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                    {proj.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
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
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-gray-900 border-b border-gray-300">EDUCATION</h2>
          <div className="space-y-3">
            {resume.education.map((edu, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-sm">
                    {edu.degree} in {edu.field}
                  </h3>
                  <span className="text-xs text-gray-600">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{edu.school}</p>
                {edu.gpa && <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-gray-900 border-b border-gray-300">CERTIFICATIONS</h2>
          <div className="space-y-2">
            {resume.certifications.map((cert, idx) => (
              <div key={idx}>
                <h3 className="font-bold text-sm">{cert.name}</h3>
                <p className="text-sm text-gray-700">{cert.issuer}</p>
                <p className="text-xs text-gray-600">Issued: {formatDate(cert.date)}</p>
                {cert.credentialId && <p className="text-xs text-gray-600">Credential ID: {cert.credentialId}</p>}
                {cert.verificationUrl && (
                  <a href={cert.verificationUrl} className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    Verify
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {resume.languages && resume.languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-gray-900 border-b border-gray-300">LANGUAGES</h2>
          <div className="space-y-1">
            {resume.languages.map((lang, idx) => (
              <p key={idx} className="text-sm text-gray-800">
                <span className="font-medium">{lang.language}:</span> {lang.proficiency}
              </p>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
});
