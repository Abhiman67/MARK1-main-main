"use client";

import { memo, useState, KeyboardEvent } from 'react';
import { Code2, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SkillsManagerProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export const SkillsManager = memo(function SkillsManager({ 
  skills, 
  onChange 
}: SkillsManagerProps) {
  const [inputValue, setInputValue] = useState('');

  const addSkill = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
      setInputValue('');
    }
  };

  const removeSkill = (skill: string) => {
    onChange(skills.filter(s => s !== skill));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Code2 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Skills</h3>
      </div>

      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter (e.g., React, Python, Leadership)"
          className="flex-1"
        />
        <Button onClick={addSkill} disabled={!inputValue.trim()}>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No skills added yet</p>
          <p className="text-sm mt-2">Add technical and soft skills to your resume</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <Badge key={idx} variant="secondary" className="text-sm py-1 px-3">
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Tip: Include both technical skills (React, Python) and soft skills (Leadership, Communication)
      </p>
    </Card>
  );
});
