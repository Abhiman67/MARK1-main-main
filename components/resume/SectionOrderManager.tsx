"use client";

import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export type SectionType = 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages' | 'links';

export interface SectionConfig {
  id: SectionType;
  label: string;
  visible: boolean;
  order: number;
}

interface SectionOrderManagerProps {
  sections: SectionConfig[];
  onChange: (sections: SectionConfig[]) => void;
}

const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: 'summary', label: 'Professional Summary', visible: true, order: 0 },
  { id: 'experience', label: 'Work Experience', visible: true, order: 1 },
  { id: 'education', label: 'Education', visible: true, order: 2 },
  { id: 'skills', label: 'Skills', visible: true, order: 3 },
  { id: 'projects', label: 'Projects', visible: true, order: 4 },
  { id: 'certifications', label: 'Certifications', visible: true, order: 5 },
  { id: 'languages', label: 'Languages', visible: true, order: 6 },
  { id: 'links', label: 'Links', visible: true, order: 7 },
];

export function SectionOrderManager({ sections, onChange }: SectionOrderManagerProps) {
  const handleToggleVisibility = (id: SectionType) => {
    onChange(
      sections.map(s => 
        s.id === id ? { ...s, visible: !s.visible } : s
      )
    );
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    onChange(newSections.map((s, i) => ({ ...s, order: i })));
  };

  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    onChange(newSections.map((s, i) => ({ ...s, order: i })));
  };

  const handleResetToDefault = () => {
    if (confirm('Reset section order and visibility to default?')) {
      onChange(DEFAULT_SECTIONS);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Section Order & Visibility</h3>
          <p className="text-sm text-muted-foreground">
            Drag to reorder, toggle to show/hide sections
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleResetToDefault}>
          Reset to Default
        </Button>
      </div>

      <div className="space-y-2">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <button
              className="cursor-move opacity-50 hover:opacity-100 transition-opacity"
              aria-label="Drag to reorder"
            >
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </button>

            <div className="flex-1 flex items-center gap-3">
              <Switch
                checked={section.visible}
                onCheckedChange={() => handleToggleVisibility(section.id)}
                id={`section-${section.id}`}
              />
              <Label htmlFor={`section-${section.id}`} className="cursor-pointer font-medium">
                {section.label}
              </Label>
              {!section.visible && (
                <Badge variant="secondary" className="text-xs">
                  <EyeOff className="h-3 w-3 mr-1" />
                  Hidden
                </Badge>
              )}
            </div>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                aria-label="Move up"
              >
                ↑
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMoveDown(index)}
                disabled={index === sections.length - 1}
                aria-label="Move down"
              >
                ↓
              </Button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        💡 Tip: Put your strongest sections first. Most recruiters spend only 6-7 seconds on initial scan.
      </p>
    </div>
  );
}
