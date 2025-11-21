"use client";

import { useState } from 'react';
import { Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResumeTemplate, type ResumeData, type TemplateType } from './templates';

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplate: TemplateType;
  onSelectTemplate: (template: TemplateType) => void;
  resumeData: ResumeData;
}

const templates = [
  {
    id: 'modern' as TemplateType,
    name: 'Modern',
    description: 'Clean and contemporary design with blue accents',
    color: 'bg-blue-500',
  },
  {
    id: 'classic' as TemplateType,
    name: 'Classic',
    description: 'Traditional professional layout with serif fonts',
    color: 'bg-gray-700',
  },
  {
    id: 'creative' as TemplateType,
    name: 'Creative',
    description: 'Bold and eye-catching with purple sidebar',
    color: 'bg-purple-500',
  },
];

export function TemplatePreviewModal({
  isOpen,
  onClose,
  currentTemplate,
  onSelectTemplate,
  resumeData,
}: TemplatePreviewModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(currentTemplate);

  const handleApply = () => {
    onSelectTemplate(selectedTemplate);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Resume Template</DialogTitle>
          <DialogDescription>
            Preview and select a template. Your content will be preserved.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mt-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`relative border-2 rounded-lg p-3 transition-all ${
                selectedTemplate === template.id
                  ? 'border-primary shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {selectedTemplate === template.id && (
                <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1">
                  <Check className="h-4 w-4" />
                </div>
              )}
              
              {currentTemplate === template.id && (
                <Badge className="absolute top-2 left-2" variant="secondary">
                  Current
                </Badge>
              )}

              <div className="aspect-[8.5/11] bg-gray-100 dark:bg-gray-800 rounded overflow-hidden mb-3">
                <div className="scale-[0.2] origin-top-left w-[500%] h-[500%]">
                  <ResumeTemplate resume={resumeData} template={template.id} />
                </div>
              </div>

              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-3 h-3 rounded-full ${template.color}`} />
                  <h3 className="font-semibold">{template.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleApply}
            disabled={selectedTemplate === currentTemplate}
          >
            Apply Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
