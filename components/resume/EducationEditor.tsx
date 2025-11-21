"use client";

import { memo } from 'react';
import { GraduationCap, Plus, Trash2, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

interface EducationEditorProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export const EducationEditor = memo(function EducationEditor({ 
  education, 
  onChange 
}: EducationEditorProps) {
  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };
    onChange([...education, newEdu]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const removeEducation = (id: string) => {
    onChange(education.filter(edu => edu.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Education</h3>
        </div>
        <Button onClick={addEducation} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      {education.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No education added yet</p>
          <Button onClick={addEducation} variant="outline" className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Your Education
          </Button>
        </Card>
      )}

      {education.map((edu, idx) => (
        <Card key={edu.id} className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
              <span className="text-sm font-medium text-muted-foreground">
                Education #{idx + 1}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => removeEducation(edu.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor={`school-${edu.id}`}>School / University *</Label>
              <Input
                id={`school-${edu.id}`}
                value={edu.school}
                onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                placeholder="Stanford University"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`degree-${edu.id}`}>Degree *</Label>
              <Input
                id={`degree-${edu.id}`}
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                placeholder="Bachelor of Science"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`field-${edu.id}`}>Field of Study *</Label>
              <Input
                id={`field-${edu.id}`}
                value={edu.field}
                onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                placeholder="Computer Science"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`startDate-${edu.id}`}>Start Date *</Label>
              <Input
                id={`startDate-${edu.id}`}
                type="month"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`endDate-${edu.id}`}>End Date *</Label>
              <Input
                id={`endDate-${edu.id}`}
                type="month"
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor={`gpa-${edu.id}`}>GPA (Optional)</Label>
              <Input
                id={`gpa-${edu.id}`}
                value={edu.gpa}
                onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                placeholder="3.8 / 4.0"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
});
