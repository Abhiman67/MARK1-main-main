"use client";

import { memo } from 'react';
import { FileText } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface SummaryEditorProps {
  summary: string;
  onChange: (summary: string) => void;
}

const RECOMMENDED_LENGTH = { min: 100, max: 300 };

export const SummaryEditor = memo(function SummaryEditor({ 
  summary, 
  onChange 
}: SummaryEditorProps) {
  const charCount = summary.length;
  const isOptimal = charCount >= RECOMMENDED_LENGTH.min && charCount <= RECOMMENDED_LENGTH.max;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Professional Summary</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">
          Summary *
          <span className="text-xs text-muted-foreground ml-2">
            (Recommended: {RECOMMENDED_LENGTH.min}-{RECOMMENDED_LENGTH.max} characters)
          </span>
        </Label>
        <Textarea
          id="summary"
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write a compelling professional summary that highlights your key skills, experience, and career goals..."
          rows={6}
          className="resize-none"
        />
        <div className="flex items-center justify-between text-xs">
          <span className={`${isOptimal ? 'text-green-600' : 'text-muted-foreground'}`}>
            {charCount} characters
            {charCount < RECOMMENDED_LENGTH.min && ` (${RECOMMENDED_LENGTH.min - charCount} more recommended)`}
            {charCount > RECOMMENDED_LENGTH.max && ` (${charCount - RECOMMENDED_LENGTH.max} over recommended)`}
          </span>
          {isOptimal && <span className="text-green-600">✓ Optimal length</span>}
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 text-sm">
        <p className="font-medium mb-2">💡 Tips for a great summary:</p>
        <ul className="space-y-1 text-muted-foreground list-disc list-inside">
          <li>Start with your years of experience and job title</li>
          <li>Highlight 2-3 key accomplishments with numbers</li>
          <li>Include relevant technical skills and certifications</li>
          <li>End with your career goals or what you&apos;re seeking</li>
        </ul>
      </div>
    </Card>
  );
});
