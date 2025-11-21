"use client";

import { CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ATSScoreBadgeProps {
  score: number;
  className?: string;
  showDetails?: boolean;
}

export function ATSScoreBadge({ score, className, showDetails = false }: ATSScoreBadgeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-300 dark:bg-green-950 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-400';
    return 'text-red-600 bg-red-50 border-red-300 dark:bg-red-950 dark:text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  const ScoreIcon = score >= 70 ? CheckCircle : AlertCircle;

  if (!showDetails) {
    return (
      <Badge
        className={cn(
          'font-semibold text-base px-4 py-2 border-2 shadow-sm',
          getScoreColor(score),
          className
        )}
      >
        <ScoreIcon className="h-4 w-4 mr-2" />
        ATS Score: {score}%
      </Badge>
    );
  }

  return (
    <div className={cn('space-y-3 p-4 rounded-lg border-2', getScoreColor(score), className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ScoreIcon className="h-5 w-5" />
          <span className="font-bold text-lg">{score}%</span>
        </div>
        <Badge variant="outline" className="font-medium">
          {getScoreLabel(score)}
        </Badge>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>ATS Compatibility</span>
          <span className="font-medium">{score}%</span>
        </div>
        <Progress value={score} className="h-2" />
      </div>

      <div className="text-xs space-y-1 opacity-90">
        <div className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          <span>
            {score >= 80 ? 'Highly likely to pass ATS screening' : 
             score >= 60 ? 'Good chance of passing ATS screening' : 
             'Consider adding more keywords and metrics'}
          </span>
        </div>
      </div>
    </div>
  );
}

// Floating variant for persistent display during editing
interface FloatingATSScoreBadgeProps {
  score: number;
  onExpand?: () => void;
}

export function FloatingATSScoreBadge({ score, onExpand }: FloatingATSScoreBadgeProps) {
  return (
    <button
      onClick={onExpand}
      className="fixed bottom-6 right-6 z-50 shadow-2xl hover:scale-105 transition-transform"
      aria-label="ATS Score"
    >
      <ATSScoreBadge score={score} />
    </button>
  );
}
