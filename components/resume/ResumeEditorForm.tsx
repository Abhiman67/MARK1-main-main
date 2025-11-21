"use client";

import { memo } from 'react';
import { Resume } from '@/hooks/useATSScore';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PersonalInfoForm } from './PersonalInfoForm';
import { SummaryEditor } from './SummaryEditor';
import { ExperienceEditor } from './ExperienceEditor';
import { EducationEditor } from './EducationEditor';
import { SkillsManager } from './SkillsManager';
import { ProjectsEditor } from './ProjectsEditor';
import { CertificationsEditor } from './CertificationsEditor';
import { LanguagesEditor } from './LanguagesEditor';
import { LinksEditor } from './LinksEditor';

interface ResumeEditorFormProps {
  resume: Resume | null;
  onChange: (updatedFields: Partial<Resume>) => void;
}

export const ResumeEditorForm = memo(function ResumeEditorForm({
  resume,
  onChange,
}: ResumeEditorFormProps) {
  if (!resume) return <div className="p-8 text-center text-muted-foreground">No resume selected</div>;

  const handlePersonalInfoChange = (field: string, value: string) => {
    onChange({
      personalInfo: {
        ...resume.personalInfo,
        [field]: value,
      }
    });
  };

  return (
    <ScrollArea className="h-[700px] pr-4">
      <Accordion type="multiple" defaultValue={['personal', 'summary']} className="space-y-4">
        <AccordionItem value="personal" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <span className="text-base font-semibold">Personal Information</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <PersonalInfoForm
              data={resume.personalInfo}
              onChange={handlePersonalInfoChange}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="summary" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <span className="text-base font-semibold">Professional Summary</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <SummaryEditor
              summary={resume.summary}
              onChange={(value) => onChange({ summary: value })}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <span className="text-base font-semibold">Work Experience</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <ExperienceEditor
              experiences={resume.experience}
              onChange={(value) => onChange({ experience: value })}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="education" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <span className="text-base font-semibold">Education</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <EducationEditor
              education={resume.education}
              onChange={(value) => onChange({ education: value })}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skills" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <span className="text-base font-semibold">Skills</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <SkillsManager
              skills={resume.skills}
              onChange={(value) => onChange({ skills: value })}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="projects" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <span className="text-base font-semibold">Projects</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <ProjectsEditor
              projects={resume.projects || []}
              onChange={(value) => onChange({ projects: value })}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="certifications" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <span className="text-base font-semibold">Certifications</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <CertificationsEditor
              certifications={resume.certifications || []}
              onChange={(value) => onChange({ certifications: value })}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="languages" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <span className="text-base font-semibold">Languages</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <LanguagesEditor
              languages={resume.languages || []}
              onChange={(value) => onChange({ languages: value })}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="links" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <span className="text-base font-semibold">Portfolio & Links</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <LinksEditor
              links={resume.links || []}
              onChange={(value) => onChange({ links: value })}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </ScrollArea>
  );
});
