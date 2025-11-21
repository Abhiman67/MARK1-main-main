"use client";

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DateInput } from './DateInput';
import { AchievementList } from './AchievementList';

interface VolunteerExperience {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

interface VolunteerEditorProps {
  volunteer: VolunteerExperience[];
  onChange: (volunteer: VolunteerExperience[]) => void;
}

export function VolunteerEditor({ volunteer, onChange }: VolunteerEditorProps) {
  const addVolunteer = () => {
    const newVolunteer: VolunteerExperience = {
      id: Date.now().toString(),
      organization: '',
      role: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
    };
    onChange([...volunteer, newVolunteer]);
  };

  const updateVolunteer = (id: string, field: keyof VolunteerExperience, value: any) => {
    onChange(volunteer.map(vol => 
      vol.id === id ? { ...vol, [field]: value } : vol
    ));
  };

  const deleteVolunteer = (id: string) => {
    onChange(volunteer.filter(vol => vol.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Volunteer Experience</h3>
        <Button size="sm" variant="outline" onClick={addVolunteer}>
          <Plus className="h-4 w-4 mr-1" />
          Add Volunteer Work
        </Button>
      </div>

      {volunteer.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground mb-3">No volunteer experience added yet</p>
          <Button onClick={addVolunteer} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Volunteer Role
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {volunteer.map((vol) => (
          <div key={vol.id} className="p-4 rounded-lg border space-y-3">
            <div className="flex items-center justify-between">
              <Input
                placeholder="Organization Name"
                value={vol.organization}
                onChange={(e) => updateVolunteer(vol.id, 'organization', e.target.value)}
                className="flex-1 mr-2"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => deleteVolunteer(vol.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <Input
              placeholder="Role/Position"
              value={vol.role}
              onChange={(e) => updateVolunteer(vol.id, 'role', e.target.value)}
            />

            <div className="grid grid-cols-2 gap-2">
              <DateInput
                label="Start Date"
                value={vol.startDate}
                onChange={(value) => updateVolunteer(vol.id, 'startDate', value)}
              />
              <DateInput
                label="End Date"
                value={vol.endDate}
                onChange={(value) => updateVolunteer(vol.id, 'endDate', value)}
                disabled={vol.current}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={vol.current}
                onChange={(e) => {
                  updateVolunteer(vol.id, 'current', e.target.checked);
                  if (e.target.checked) updateVolunteer(vol.id, 'endDate', '');
                }}
                className="rounded"
                id={`current-${vol.id}`}
              />
              <label htmlFor={`current-${vol.id}`} className="text-sm">
                Currently volunteering here
              </label>
            </div>

            <Textarea
              placeholder="Brief description of your volunteer work"
              value={vol.description}
              onChange={(e) => updateVolunteer(vol.id, 'description', e.target.value)}
              rows={2}
            />

            <AchievementList
              achievements={vol.achievements}
              onChange={(achievements) => updateVolunteer(vol.id, 'achievements', achievements)}
            />
          </div>
        ))}
      </div>

      {volunteer.length > 0 && (
        <p className="text-xs text-muted-foreground">
          💡 Tip: Volunteer work shows character, leadership, and commitment to causes beyond work
        </p>
      )}
    </div>
  );
}
