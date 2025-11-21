"use client";

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Tag, Layout, FileText, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { AISuggestion } from '@/hooks/useAISuggestions';
import { getImpactColor } from '@/hooks/useAISuggestions';

interface AISuggestionsPanelProps {
  suggestions: AISuggestion[];
  onApplySuggestion?: (index: number) => void;
  isLoading?: boolean;
  isAIPowered?: boolean;
  onAnalyze?: () => void;
  provider?: string | null;
  cached?: boolean;
}

const iconMap = {
  improvement: Lightbulb,
  keyword: Tag,
  format: Layout,
  content: FileText,
};

export const AISuggestionsPanel = memo(function AISuggestionsPanel({
  suggestions,
  onApplySuggestion,
  isLoading = false,
  isAIPowered = false,
  onAnalyze,
  provider = null,
  cached = false,
}: AISuggestionsPanelProps) {
  if (isLoading) {
    return (
      <GlassCard className="p-6" gradient>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-500 animate-pulse" />
          <h3 className="text-lg font-semibold">AI Analyzing Resume...</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-white/5 rounded-lg"></div>
            </div>
          ))}
        </div>
      </GlassCard>
    );
  }

  if (suggestions.length === 0) {
    return (
      <GlassCard className="p-6" gradient>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold">AI Suggestions</h3>
          {provider && (
            <Badge variant="secondary" className="ml-2 text-xs">{provider}</Badge>
          )}
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Your resume looks great! No suggestions at the moment.</p>
          {onAnalyze && (
            <div className="mt-4">
              <Button onClick={onAnalyze} variant="outline">Analyze Resume</Button>
            </div>
          )}
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6" gradient>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold">{isAIPowered ? 'AI-Powered Suggestions' : 'Resume Suggestions'}</h3>
          {isAIPowered && (
            <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
              Gemini AI
            </Badge>
          )}
          {provider && !isAIPowered && (
            <Badge variant="secondary" className="text-xs ml-2">{provider}</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {cached && <Badge variant="outline" className="text-xs">Cached</Badge>}
          {onAnalyze && (
            <Button size="sm" variant="ghost" onClick={onAnalyze} className="h-7 text-xs">Analyze</Button>
          )}
          <Badge variant="secondary">{suggestions.length}</Badge>
        </div>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => {
            const Icon = iconMap[suggestion.type] || Lightbulb;
            const impactColor = getImpactColor(suggestion.impact);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-purple-500/20">
                    <Icon className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-medium text-sm">{suggestion.title}</h4>
                      <Badge variant="outline" className={`text-xs ${impactColor}`}>
                        {suggestion.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>
                    {suggestion.keywords && suggestion.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {suggestion.keywords.map((keyword, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {onApplySuggestion && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs mt-2"
                        onClick={() => onApplySuggestion(index)}
                      >
                        Apply Suggestion
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>
    </GlassCard>
  );
});
