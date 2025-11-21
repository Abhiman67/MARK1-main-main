"use client";

import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface AchievementListProps {
  achievements: string[];
  onChange: (achievements: string[]) => void;
  placeholder?: string;
}

export function AchievementList({ 
  achievements, 
  onChange,
  placeholder = "Led team of 5 engineers to deliver project 2 months ahead of schedule, resulting in $500K cost savings..."
}: AchievementListProps) {
  const addAchievement = () => {
    onChange([...achievements, '']);
  };

  const updateAchievement = (index: number, value: string) => {
    const updated = [...achievements];
    updated[index] = value;
    onChange(updated);
  };

  const removeAchievement = (index: number) => {
    onChange(achievements.filter((_, i) => i !== index));
  };

  const moveAchievement = (fromIndex: number, toIndex: number) => {
    const updated = [...achievements];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Achievements & Responsibilities</label>
        <Button
          onClick={addAchievement}
          variant="outline"
          size="sm"
          type="button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Achievement
        </Button>
      </div>

      {achievements.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground mb-3">No achievements added yet</p>
          <Button onClick={addAchievement} variant="outline" size="sm" type="button">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Achievement
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {achievements.map((achievement, index) => (
          <div key={index} className="flex gap-2 group">
            <button
              type="button"
              className="mt-2 cursor-move opacity-50 hover:opacity-100 transition-opacity"
              onMouseDown={(e) => {
                // Simple drag placeholder - full implementation would use react-beautiful-dnd
                e.preventDefault();
              }}
            >
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </button>
            
            <div className="flex-1 space-y-1">
              <Textarea
                value={achievement}
                onChange={(e) => updateAchievement(index, e.target.value)}
                placeholder={index === 0 ? placeholder : "Another key achievement..."}
                rows={2}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                💡 Tip: Start with action verbs, include numbers and results
              </p>
            </div>

            <Button
              onClick={() => removeAchievement(index)}
              variant="ghost"
              size="sm"
              type="button"
              className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Delete achievement"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      {achievements.length > 0 && (
        <p className="text-xs text-muted-foreground">
          ✓ Aim for 3-5 achievements per role • Use numbers and metrics • Keep bullets concise
        </p>
      )}
    </div>
  );
}
