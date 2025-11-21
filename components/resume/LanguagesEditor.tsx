"use client";

import { memo } from 'react';
import { Languages, Plus, Trash2, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Language {
  id: string;
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Intermediate' | 'Basic';
}

interface LanguagesEditorProps {
  languages: Language[];
  onChange: (languages: Language[]) => void;
}

const proficiencyLevels: Language['proficiency'][] = ['Native', 'Fluent', 'Intermediate', 'Basic'];

export const LanguagesEditor = memo(function LanguagesEditor({ 
  languages, 
  onChange 
}: LanguagesEditorProps) {
  const addLanguage = () => {
    const newLang: Language = {
      id: Date.now().toString(),
      language: '',
      proficiency: 'Intermediate',
    };
    onChange([...languages, newLang]);
  };

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    onChange(languages.map(lang => 
      lang.id === id ? { ...lang, [field]: value } : lang
    ));
  };

  const removeLanguage = (id: string) => {
    onChange(languages.filter(lang => lang.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Languages</h3>
        </div>
        <Button onClick={addLanguage} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Language
        </Button>
      </div>

      {languages.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No languages added yet</p>
          <Button onClick={addLanguage} variant="outline" className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Language
          </Button>
        </Card>
      )}

      {languages.map((lang, idx) => (
        <Card key={lang.id} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
              <span className="text-sm font-medium text-muted-foreground">
                Language #{idx + 1}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => removeLanguage(lang.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`language-${lang.id}`}>Language *</Label>
              <Input
                id={`language-${lang.id}`}
                value={lang.language}
                onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                placeholder="English, Spanish, etc."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`proficiency-${lang.id}`}>Proficiency *</Label>
              <Select
                value={lang.proficiency}
                onValueChange={(value) => updateLanguage(lang.id, 'proficiency', value)}
              >
                <SelectTrigger id={`proficiency-${lang.id}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {proficiencyLevels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
});
