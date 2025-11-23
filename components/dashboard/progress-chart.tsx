"use client";

import dynamic from 'next/dynamic';
import { GlassCard } from '@/components/ui/glass-card';

const ProgressChartClient = dynamic(
  () => import('./ProgressChartClient'),
  { ssr: false, loading: () => (
    <GlassCard className="p-6" gradient>
      <div className="h-64 flex items-center justify-center">
        <span className="text-muted-foreground">Loading chart...</span>
      </div>
    </GlassCard>
  ) }
);

export function ProgressChart() {
  return <ProgressChartClient />;
}