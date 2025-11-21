// @ts-nocheck
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

// Import types from the app - we'll use any for flexibility
type Resume = any;

// Date formatting helper
function formatDate(dateStr: string, format: 'short' | 'long' = 'short'): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    
    if (format === 'short') {
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

/**
 * Export resume to DOCX format (Microsoft Word)
 */
export async function exportToDocx(resume: Resume): Promise<void> {
  const sections: Paragraph[] = [];

  // Header - Name and Title
  sections.push(
    new Paragraph({
      text: resume.personalInfo.fullName,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    })
  );

  if (resume.personalInfo.title) {
    sections.push(
      new Paragraph({
        text: resume.personalInfo.title,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  }

  // Contact Information
  const contactParts: string[] = [];
  if (resume.personalInfo.email) contactParts.push(resume.personalInfo.email);
  if (resume.personalInfo.phone) contactParts.push(resume.personalInfo.phone);
  if (resume.personalInfo.location) contactParts.push(resume.personalInfo.location);

  if (contactParts.length > 0) {
    sections.push(
      new Paragraph({
        text: contactParts.join(' • '),
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  }

  // Links
  if (resume.links && resume.links.length > 0) {
    const linkText = resume.links.map(link => `${link.type}: ${link.url}`).join(' • ');
    sections.push(
      new Paragraph({
        text: linkText,
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      })
    );
  }

  // Professional Summary
  if (resume.summary) {
    sections.push(
      new Paragraph({
        text: 'PROFESSIONAL SUMMARY',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 },
        border: {
          bottom: {
            color: '000000',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );
    sections.push(
      new Paragraph({
        text: resume.summary,
        spacing: { after: 200 },
      })
    );
  }

  // Skills
  if (resume.skills.length > 0) {
    sections.push(
      new Paragraph({
        text: 'SKILLS',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 },
        border: {
          bottom: {
            color: '000000',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );
    sections.push(
      new Paragraph({
        text: resume.skills.join(' • '),
        spacing: { after: 200 },
      })
    );
  }

  // Experience
  if (resume.experience.length > 0) {
    sections.push(
      new Paragraph({
        text: 'EXPERIENCE',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 },
        border: {
          bottom: {
            color: '000000',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );

    resume.experience.forEach((exp) => {
      const startDate = formatDate(exp.startDate);
      const endDate = exp.current ? 'Present' : formatDate(exp.endDate);

      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.position, bold: true }),
            new TextRun({ text: ` at ${exp.company}`, bold: true }),
          ],
          spacing: { before: 150, after: 50 },
        })
      );

      sections.push(
        new Paragraph({
          text: `${startDate} - ${endDate}`,
          italics: true,
          spacing: { after: 100 },
        })
      );

      if (exp.description) {
        sections.push(
          new Paragraph({
            text: exp.description,
            spacing: { after: 100 },
          })
        );
      }

      exp.achievements.forEach((achievement) => {
        sections.push(
          new Paragraph({
            text: achievement,
            bullet: { level: 0 },
            spacing: { after: 50 },
          })
        );
      });
    });
  }

  // Education
  if (resume.education.length > 0) {
    sections.push(
      new Paragraph({
        text: 'EDUCATION',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 },
        border: {
          bottom: {
            color: '000000',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );

    resume.education.forEach((edu) => {
      const startDate = formatDate(edu.startDate);
      const endDate = edu.current ? 'Present' : formatDate(edu.endDate);

      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree, bold: true }),
          ],
          spacing: { before: 150, after: 50 },
        })
      );

      sections.push(
        new Paragraph({
          text: `${edu.institution} • ${startDate} - ${endDate}`,
          italics: true,
          spacing: { after: 100 },
        })
      );

      if (edu.description) {
        sections.push(
          new Paragraph({
            text: edu.description,
            spacing: { after: 100 },
          })
        );
      }
    });
  }

  // Projects
  if (resume.projects && resume.projects.length > 0) {
    sections.push(
      new Paragraph({
        text: 'PROJECTS',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 },
        border: {
          bottom: {
            color: '000000',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );

    resume.projects.forEach((project) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: project.name, bold: true }),
          ],
          spacing: { before: 150, after: 50 },
        })
      );

      if (project.technologies.length > 0) {
        sections.push(
          new Paragraph({
            text: `Technologies: ${project.technologies.join(', ')}`,
            italics: true,
            spacing: { after: 100 },
          })
        );
      }

      sections.push(
        new Paragraph({
          text: project.description,
          spacing: { after: 100 },
        })
      );

      if (project.link) {
        sections.push(
          new Paragraph({
            text: `Link: ${project.link}`,
            spacing: { after: 100 },
          })
        );
      }

      project.highlights.forEach((highlight) => {
        sections.push(
          new Paragraph({
            text: highlight,
            bullet: { level: 0 },
            spacing: { after: 50 },
          })
        );
      });
    });
  }

  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    sections.push(
      new Paragraph({
        text: 'CERTIFICATIONS',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 },
        border: {
          bottom: {
            color: '000000',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );

    resume.certifications.forEach((cert) => {
      const certText = `${cert.name} - ${cert.issuer} (${formatDate(cert.date, 'long')})`;
      sections.push(
        new Paragraph({
          text: certText,
          bullet: { level: 0 },
          spacing: { after: 100 },
        })
      );
    });
  }

  // Languages
  if (resume.languages && resume.languages.length > 0) {
    sections.push(
      new Paragraph({
        text: 'LANGUAGES',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 },
        border: {
          bottom: {
            color: '000000',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );

    const langText = resume.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(' • ');
    sections.push(
      new Paragraph({
        text: langText,
        spacing: { after: 200 },
      })
    );
  }

  // Awards
  if (resume.awards && resume.awards.length > 0) {
    sections.push(
      new Paragraph({
        text: 'AWARDS & HONORS',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 },
        border: {
          bottom: {
            color: '000000',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );

    resume.awards.forEach((award) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${award.title} - ${award.issuer}`, bold: true }),
            new TextRun({ text: ` (${formatDate(award.date, 'long')})` }),
          ],
          spacing: { before: 100, after: 50 },
        })
      );

      if (award.description) {
        sections.push(
          new Paragraph({
            text: award.description,
            spacing: { after: 100 },
          })
        );
      }
    });
  }

  // Volunteer Experience
  if (resume.volunteer && resume.volunteer.length > 0) {
    sections.push(
      new Paragraph({
        text: 'VOLUNTEER EXPERIENCE',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 },
        border: {
          bottom: {
            color: '000000',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );

    resume.volunteer.forEach((vol) => {
      const startDate = formatDate(vol.startDate);
      const endDate = vol.current ? 'Present' : formatDate(vol.endDate);

      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: vol.role, bold: true }),
            new TextRun({ text: ` at ${vol.organization}` }),
          ],
          spacing: { before: 150, after: 50 },
        })
      );

      sections.push(
        new Paragraph({
          text: `${startDate} - ${endDate}`,
          italics: true,
          spacing: { after: 100 },
        })
      );

      if (vol.description) {
        sections.push(
          new Paragraph({
            text: vol.description,
            spacing: { after: 100 },
          })
        );
      }
    });
  }

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sections,
      },
    ],
  });

  // Generate and download
  const blob = await Packer.toBlob(doc);
  const fileName = `${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.docx`;
  saveAs(blob, fileName);
}

/**
 * Export resume to JSON format (data backup)
 */
export function exportToJson(resume: Resume): void {
  const dataStr = JSON.stringify(resume, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const fileName = `${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.json`;
  saveAs(blob, fileName);
}

/**
 * Export resume to plain text format (ATS-friendly)
 */
export function exportToPlainText(resume: Resume): void {
  let text = '';
  const separator = '='.repeat(60);

  // Header
  text += `${resume.personalInfo.fullName}\n`;
  if (resume.personalInfo.title) text += `${resume.personalInfo.title}\n`;
  text += '\n';

  // Contact
  if (resume.personalInfo.email) text += `Email: ${resume.personalInfo.email}\n`;
  if (resume.personalInfo.phone) text += `Phone: ${resume.personalInfo.phone}\n`;
  if (resume.personalInfo.location) text += `Location: ${resume.personalInfo.location}\n`;
  text += '\n';

  // Links
  if (resume.links && resume.links.length > 0) {
    text += `LINKS\n${separator}\n`;
    resume.links.forEach(link => {
      text += `${link.type}: ${link.url}\n`;
    });
    text += '\n';
  }

  // Summary
  if (resume.summary) {
    text += `PROFESSIONAL SUMMARY\n${separator}\n${resume.summary}\n\n`;
  }

  // Skills
  if (resume.skills.length > 0) {
    text += `SKILLS\n${separator}\n${resume.skills.join(' • ')}\n\n`;
  }

  // Experience
  if (resume.experience.length > 0) {
    text += `EXPERIENCE\n${separator}\n`;
    resume.experience.forEach(exp => {
      const startDate = formatDate(exp.startDate);
      const endDate = exp.current ? 'Present' : formatDate(exp.endDate);
      
      text += `\n${exp.position} at ${exp.company}\n`;
      text += `${startDate} - ${endDate}\n`;
      if (exp.description) text += `${exp.description}\n`;
      exp.achievements.forEach(ach => {
        text += `  • ${ach}\n`;
      });
    });
    text += '\n';
  }

  // Education
  if (resume.education.length > 0) {
    text += `EDUCATION\n${separator}\n`;
    resume.education.forEach(edu => {
      const startDate = formatDate(edu.startDate);
      const endDate = edu.current ? 'Present' : formatDate(edu.endDate);
      
      text += `\n${edu.degree}\n`;
      text += `${edu.institution} • ${startDate} - ${endDate}\n`;
      if (edu.description) text += `${edu.description}\n`;
    });
    text += '\n';
  }

  // Projects
  if (resume.projects && resume.projects.length > 0) {
    text += `PROJECTS\n${separator}\n`;
    resume.projects.forEach(project => {
      text += `\n${project.name}\n`;
      if (project.technologies.length > 0) {
        text += `Technologies: ${project.technologies.join(', ')}\n`;
      }
      text += `${project.description}\n`;
      if (project.link) text += `Link: ${project.link}\n`;
      project.highlights.forEach(highlight => {
        text += `  • ${highlight}\n`;
      });
    });
    text += '\n';
  }

  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    text += `CERTIFICATIONS\n${separator}\n`;
    resume.certifications.forEach(cert => {
      text += `• ${cert.name} - ${cert.issuer} (${formatDate(cert.date, 'long')})\n`;
    });
    text += '\n';
  }

  // Languages
  if (resume.languages && resume.languages.length > 0) {
    text += `LANGUAGES\n${separator}\n`;
    const langText = resume.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(' • ');
    text += `${langText}\n\n`;
  }

  // Awards
  if (resume.awards && resume.awards.length > 0) {
    text += `AWARDS & HONORS\n${separator}\n`;
    resume.awards.forEach(award => {
      text += `\n${award.title} - ${award.issuer} (${formatDate(award.date, 'long')})\n`;
      if (award.description) text += `${award.description}\n`;
    });
    text += '\n';
  }

  // Volunteer
  if (resume.volunteer && resume.volunteer.length > 0) {
    text += `VOLUNTEER EXPERIENCE\n${separator}\n`;
    resume.volunteer.forEach(vol => {
      const startDate = formatDate(vol.startDate);
      const endDate = vol.current ? 'Present' : formatDate(vol.endDate);
      
      text += `\n${vol.role} at ${vol.organization}\n`;
      text += `${startDate} - ${endDate}\n`;
      if (vol.description) text += `${vol.description}\n`;
    });
    text += '\n';
  }

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const fileName = `${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.txt`;
  saveAs(blob, fileName);
}
