"use client";

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DateInput } from './DateInput';

interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

interface AwardsEditorProps {
  awards: Award[];
  onChange: (awards: Award[]) => void;
}

export function AwardsEditor({ awards, onChange }: AwardsEditorProps) {
  const addAward = () => {
    const newAward: Award = {
      id: Date.now().toString(),
      title: '',
      issuer: '',
      date: '',
      description: '',
    };
    onChange([...awards, newAward]);
  };

  const updateAward = (id: string, field: keyof Award, value: string) => {
    onChange(awards.map(award => 
      award.id === id ? { ...award, [field]: value } : award
    ));
  };

  const deleteAward = (id: string) => {
    onChange(awards.filter(award => award.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Awards & Honors</h3>
        <Button size="sm" variant="outline" onClick={addAward}>
          <Plus className="h-4 w-4 mr-1" />
          Add Award
        </Button>
      </div>

      {awards.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground mb-3">No awards added yet</p>
          <Button onClick={addAward} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Award
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {awards.map((award) => (
          <div key={award.id} className="p-4 rounded-lg border space-y-3">
            <div className="flex items-center justify-between">
              <Input
                placeholder="Award Title (e.g., Employee of the Year)"
                value={award.title}
                onChange={(e) => updateAward(award.id, 'title', e.target.value)}
                className="flex-1 mr-2"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => deleteAward(award.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <Input
              placeholder="Issuing Organization (e.g., Tech Corp, IEEE)"
              value={award.issuer}
              onChange={(e) => updateAward(award.id, 'issuer', e.target.value)}
            />

            <DateInput
              label="Date Received"
              value={award.date}
              onChange={(value) => updateAward(award.id, 'date', value)}
              placeholder="MM/YYYY"
            />

            <Textarea
              placeholder="Description (optional) - Why you received this award, impact, etc."
              value={award.description}
              onChange={(e) => updateAward(award.id, 'description', e.target.value)}
              rows={2}
            />
          </div>
        ))}
      </div>

      {awards.length > 0 && (
        <p className="text-xs text-muted-foreground">
          💡 Tip: Highlight awards that demonstrate leadership, technical excellence, or significant achievements
        </p>
      )}
    </div>
  );
}
