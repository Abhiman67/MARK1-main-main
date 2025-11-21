"use client";

import { memo } from 'react';
import { Briefcase, Plus, Trash2, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

interface ExperienceEditorProps {
  experiences: WorkExperience[];
  onChange: (experiences: WorkExperience[]) => void;
}

export const ExperienceEditor = memo(function ExperienceEditor({ 
  experiences, 
  onChange 
}: ExperienceEditorProps) {
  const addExperience = () => {
    const newExp: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [''],
    };
    onChange([...experiences, newExp]);
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: any) => {
    onChange(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const removeExperience = (id: string) => {
    onChange(experiences.filter(exp => exp.id !== id));
  };

  const addAchievement = (expId: string) => {
    onChange(experiences.map(exp => 
      exp.id === expId ? { ...exp, achievements: [...exp.achievements, ''] } : exp
    ));
  };

  const updateAchievement = (expId: string, index: number, value: string) => {
    onChange(experiences.map(exp => {
      if (exp.id === expId) {
        const newAchievements = [...exp.achievements];
        newAchievements[index] = value;
        return { ...exp, achievements: newAchievements };
      }
      return exp;
    }));
  };

  const removeAchievement = (expId: string, index: number) => {
    onChange(experiences.map(exp => {
      if (exp.id === expId) {
        return { ...exp, achievements: exp.achievements.filter((_, i) => i !== index) };
      }
      return exp;
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Work Experience</h3>
        </div>
        <Button onClick={addExperience} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {experiences.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No work experience added yet</p>
          <Button onClick={addExperience} variant="outline" className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Job
          </Button>
        </Card>
      )}

      {experiences.map((exp, idx) => (
        <Card key={exp.id} className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
              <span className="text-sm font-medium text-muted-foreground">
                Experience #{idx + 1}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => removeExperience(exp.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`company-${exp.id}`}>Company *</Label>
              <Input
                id={`company-${exp.id}`}
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                placeholder="Acme Corp"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`position-${exp.id}`}>Position *</Label>
              <Input
                id={`position-${exp.id}`}
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                placeholder="Senior Developer"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`startDate-${exp.id}`}>Start Date *</Label>
              <Input
                id={`startDate-${exp.id}`}
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`endDate-${exp.id}`}>End Date</Label>
              <Input
                id={`endDate-${exp.id}`}
                type="month"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                disabled={exp.current}
                placeholder={exp.current ? 'Present' : ''}
              />
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor={`current-${exp.id}`} className="cursor-pointer">
                  I currently work here
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Key Achievements</Label>
              <Button 
                onClick={() => addAchievement(exp.id)} 
                variant="outline" 
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Achievement
              </Button>
            </div>

            {exp.achievements.map((achievement, achIdx) => (
              <div key={achIdx} className="flex gap-2">
                <Textarea
                  value={achievement}
                  onChange={(e) => updateAchievement(exp.id, achIdx, e.target.value)}
                  placeholder="Led team of 5 engineers to deliver project 2 months ahead of schedule..."
                  rows={2}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAchievement(exp.id, achIdx)}
                  disabled={exp.achievements.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
});
