import { useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import type { Resume } from './useATSScore';

export interface UseResumeExportReturn {
  exportToPDF: () => Promise<void>;
  exportToDOCX: () => Promise<void>;
  exportToPlainText: () => void;
  exportToJSON: () => void;
}

/**
 * Hook that provides stable export handlers for resume in multiple formats
 * @param resume - The resume object to export
 * @param previewElementId - The DOM element ID of the preview component for PDF generation
 */
export function useResumeExport(
  resume: Resume | null,
  previewElementId: string = 'resume-preview'
): UseResumeExportReturn {
  
  const exportToPDF = useCallback(async () => {
    if (!resume) return;

    try {
      const element = document.getElementById(previewElementId);
      if (!element) {
        console.error('Resume preview element not found');
        alert('Unable to find resume preview. Please try again.');
        return;
      }

      // Capture the resume as canvas with high quality
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200,
        windowHeight: element.scrollHeight,
      });

      // Calculate PDF dimensions (A4: 210mm x 297mm)
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Add image to PDF with pagination
      let position = 0;
      const pageHeight = 297; // A4 height in mm
      let heightLeft = imgHeight;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate filename
      const fileName = `${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf` || 'Resume.pdf';
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  }, [resume, previewElementId]);

  const exportToDOCX = useCallback(async () => {
    if (!resume) return;
    
    try {
      const r = resume;
      const sections = [];
      
      // Header - Name
      sections.push(
        new Paragraph({
          text: r.personalInfo.fullName,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        })
      );
      
      // Title
      if (r.personalInfo.title) {
        sections.push(
          new Paragraph({
            text: r.personalInfo.title,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          })
        );
      }
      
      // Contact Info
      const contactParts = [];
      if (r.personalInfo.email) contactParts.push(r.personalInfo.email);
      if (r.personalInfo.phone) contactParts.push(r.personalInfo.phone);
      if (r.personalInfo.location) contactParts.push(r.personalInfo.location);
      
      if (contactParts.length > 0) {
        sections.push(
          new Paragraph({
            text: contactParts.join(' | '),
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          })
        );
      }
      
      // Links
      if (r.links && r.links.length > 0) {
        sections.push(
          new Paragraph({
            text: 'LINKS',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );
        r.links.forEach(link => {
          sections.push(
            new Paragraph({
              text: `${link.platform}: ${link.url}`,
              spacing: { after: 100 },
            })
          );
        });
      }
      
      // Professional Summary
      if (r.summary) {
        sections.push(
          new Paragraph({
            text: 'PROFESSIONAL SUMMARY',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: r.summary,
            spacing: { after: 200 },
          })
        );
      }
      
      // Skills
      if (r.skills.length > 0) {
        sections.push(
          new Paragraph({
            text: 'SKILLS',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: r.skills.join(' • '),
            spacing: { after: 200 },
          })
        );
      }
      
      // Experience
      if (r.experience.length > 0) {
        sections.push(
          new Paragraph({
            text: 'EXPERIENCE',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );
        
        r.experience.forEach((exp, idx) => {
          const startDate = exp.startDate 
            ? new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
            : '';
          const endDate = exp.current 
            ? 'Present' 
            : (exp.endDate ? new Date(exp.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '');
          
          sections.push(
            new Paragraph({
              children: [
                new TextRun({ text: exp.position, bold: true }),
                new TextRun({ text: ` at ${exp.company}` }),
              ],
              spacing: { before: idx > 0 ? 150 : 0, after: 50 },
            }),
            new Paragraph({
              text: `${startDate} - ${endDate}`,
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
          
          exp.achievements.forEach(ach => {
            sections.push(
              new Paragraph({
                text: ach,
                bullet: { level: 0 },
                spacing: { after: 50 },
              })
            );
          });
        });
      }
      
      // Projects
      if (r.projects && r.projects.length > 0) {
        sections.push(
          new Paragraph({
            text: 'PROJECTS',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );
        
        r.projects.forEach((proj, idx) => {
          const startDate = proj.startDate 
            ? new Date(proj.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
            : '';
          const endDate = proj.endDate 
            ? new Date(proj.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
            : 'Present';
          
          sections.push(
            new Paragraph({
              children: [
                new TextRun({ text: proj.name, bold: true }),
              ],
              spacing: { before: idx > 0 ? 150 : 0, after: 50 },
            }),
            new Paragraph({
              text: `${startDate} - ${endDate}`,
              spacing: { after: 50 },
            }),
            new Paragraph({
              text: proj.description,
              spacing: { after: 100 },
            })
          );
          
          if (proj.technologies.length > 0) {
            sections.push(
              new Paragraph({
                text: `Technologies: ${proj.technologies.join(', ')}`,
                spacing: { after: 100 },
              })
            );
          }
          
          proj.highlights.forEach(h => {
            sections.push(
              new Paragraph({
                text: h,
                bullet: { level: 0 },
                spacing: { after: 50 },
              })
            );
          });
        });
      }
      
      // Education
      if (r.education.length > 0) {
        sections.push(
          new Paragraph({
            text: 'EDUCATION',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );
        
        r.education.forEach((edu, idx) => {
          const startDate = edu.startDate 
            ? new Date(edu.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
            : '';
          const endDate = edu.endDate 
            ? new Date(edu.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
            : '';
          
          sections.push(
            new Paragraph({
              children: [
                new TextRun({ text: edu.degree, bold: true }),
                new TextRun({ text: ` in ${edu.field}` }),
              ],
              spacing: { before: idx > 0 ? 150 : 0, after: 50 },
            }),
            new Paragraph({
              text: edu.school,
              spacing: { after: 50 },
            }),
            new Paragraph({
              text: `${startDate} - ${endDate}`,
              spacing: { after: edu.gpa ? 50 : 100 },
            })
          );
          
          if (edu.gpa) {
            sections.push(
              new Paragraph({
                text: `GPA: ${edu.gpa}`,
                spacing: { after: 100 },
              })
            );
          }
        });
      }
      
      // Certifications
      if (r.certifications && r.certifications.length > 0) {
        sections.push(
          new Paragraph({
            text: 'CERTIFICATIONS',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );
        
        r.certifications.forEach((cert, idx) => {
          const date = cert.date 
            ? new Date(cert.date + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
            : '';
          
          sections.push(
            new Paragraph({
              children: [
                new TextRun({ text: cert.name, bold: true }),
              ],
              spacing: { before: idx > 0 ? 150 : 0, after: 50 },
            }),
            new Paragraph({
              text: cert.issuer,
              spacing: { after: 50 },
            }),
            new Paragraph({
              text: `Issued: ${date}`,
              spacing: { after: cert.credentialId || cert.verificationUrl ? 50 : 100 },
            })
          );
          
          if (cert.credentialId) {
            sections.push(
              new Paragraph({
                text: `Credential ID: ${cert.credentialId}`,
                spacing: { after: 50 },
              })
            );
          }
        });
      }
      
      // Languages
      if (r.languages && r.languages.length > 0) {
        sections.push(
          new Paragraph({
            text: 'LANGUAGES',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );
        
        r.languages.forEach(lang => {
          sections.push(
            new Paragraph({
              text: `${lang.language}: ${lang.proficiency}`,
              spacing: { after: 50 },
            })
          );
        });
      }
      
      // Create document
      const doc = new Document({
        sections: [{
          properties: {},
          children: sections,
        }],
      });
      
      // Generate and download
      const blob = await Packer.toBlob(doc);
      const fileName = `${r.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.docx` || 'Resume.docx';
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Error exporting DOCX:', error);
      alert('Failed to export DOCX. Please try again.');
    }
  }, [resume]);

  const exportToPlainText = useCallback(() => {
    if (!resume) return;
    
    try {
      const r = resume;
      let text = '';
      
      // Header
      text += `${r.personalInfo.fullName}\n`;
      if (r.personalInfo.title) text += `${r.personalInfo.title}\n`;
      text += `\n`;
      
      // Contact
      if (r.personalInfo.email) text += `Email: ${r.personalInfo.email}\n`;
      if (r.personalInfo.phone) text += `Phone: ${r.personalInfo.phone}\n`;
      if (r.personalInfo.location) text += `Location: ${r.personalInfo.location}\n`;
      text += `\n`;
      
      // Links
      if (r.links && r.links.length > 0) {
        text += `LINKS\n${'='.repeat(50)}\n`;
        r.links.forEach(link => {
          text += `${link.platform}: ${link.url}\n`;
        });
        text += `\n`;
      }
      
      // Summary
      if (r.summary) {
        text += `PROFESSIONAL SUMMARY\n${'='.repeat(50)}\n${r.summary}\n\n`;
      }
      
      // Skills
      if (r.skills.length > 0) {
        text += `SKILLS\n${'='.repeat(50)}\n${r.skills.join(' • ')}\n\n`;
      }
      
      // Experience
      if (r.experience.length > 0) {
        text += `EXPERIENCE\n${'='.repeat(50)}\n`;
        r.experience.forEach(exp => {
          text += `\n${exp.position} at ${exp.company}\n`;
          const startDate = exp.startDate 
            ? new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
            : '';
          const endDate = exp.current 
            ? 'Present' 
            : (exp.endDate ? new Date(exp.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '');
          text += `${startDate} - ${endDate}\n`;
          if (exp.description) text += `${exp.description}\n`;
          if (exp.achievements.length > 0) {
            exp.achievements.forEach(ach => {
              text += `  • ${ach}\n`;
            });
          }
        });
        text += `\n`;
      }
      
      // Projects
      if (r.projects && r.projects.length > 0) {
        text += `PROJECTS\n${'='.repeat(50)}\n`;
        r.projects.forEach(proj => {
          text += `\n${proj.name}\n`;
          const startDate = proj.startDate 
            ? new Date(proj.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
            : '';
          const endDate = proj.endDate 
            ? new Date(proj.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
            : 'Present';
          text += `${startDate} - ${endDate}\n`;
          text += `${proj.description}\n`;
          if (proj.technologies.length > 0) {
            text += `Technologies: ${proj.technologies.join(', ')}\n`;
          }
          if (proj.url) text += `Link: ${proj.url}\n`;
          if (proj.highlights.length > 0) {
            proj.highlights.forEach(h => {
              text += `  • ${h}\n`;
            });
          }
        });
        text += `\n`;
      }
      
      // Education
      if (r.education.length > 0) {
        text += `EDUCATION\n${'='.repeat(50)}\n`;
        r.education.forEach(edu => {
          text += `\n${edu.degree} in ${edu.field}\n`;
          text += `${edu.school}\n`;
          const startDate = edu.startDate 
            ? new Date(edu.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
            : '';
          const endDate = edu.endDate 
            ? new Date(edu.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
            : '';
          text += `${startDate} - ${endDate}\n`;
          if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
        });
        text += `\n`;
      }
      
      // Certifications
      if (r.certifications && r.certifications.length > 0) {
        text += `CERTIFICATIONS\n${'='.repeat(50)}\n`;
        r.certifications.forEach(cert => {
          text += `\n${cert.name}\n`;
          text += `${cert.issuer}\n`;
          const date = cert.date 
            ? new Date(cert.date + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
            : '';
          text += `Issued: ${date}\n`;
          if (cert.credentialId) text += `Credential ID: ${cert.credentialId}\n`;
          if (cert.verificationUrl) text += `Verification: ${cert.verificationUrl}\n`;
        });
        text += `\n`;
      }
      
      // Languages
      if (r.languages && r.languages.length > 0) {
        text += `LANGUAGES\n${'='.repeat(50)}\n`;
        r.languages.forEach(lang => {
          text += `${lang.language}: ${lang.proficiency}\n`;
        });
        text += `\n`;
      }
      
      const dataBlob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const fileName = `${r.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.txt` || 'Resume.txt';
      saveAs(dataBlob, fileName);
    } catch (error) {
      console.error('Error exporting plain text:', error);
      alert('Failed to export plain text. Please try again.');
    }
  }, [resume]);

  const exportToJSON = useCallback(() => {
    if (!resume) return;
    
    try {
      const dataStr = JSON.stringify(resume, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const fileName = `${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.json` || 'Resume.json';
      saveAs(dataBlob, fileName);
    } catch (error) {
      console.error('Error exporting JSON:', error);
      alert('Failed to export JSON. Please try again.');
    }
  }, [resume]);

  return {
    exportToPDF,
    exportToDOCX,
    exportToPlainText,
    exportToJSON,
  };
}
