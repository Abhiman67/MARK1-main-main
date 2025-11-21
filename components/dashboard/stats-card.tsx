"use client";

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import type { ComponentType } from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: ComponentType<any>;
  color?: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color = 'blue'
}: StatsCardProps) {
  const changeColors = {
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };

  const iconColors = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    pink: 'bg-pink-500'
  };

  return (
    <GlassCard className="p-6" gradient>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <motion.p 
            className="text-2xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {value}
          </motion.p>
          <p className={`text-xs ${changeColors[changeType]}`}>
            {change}
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`rounded-full ${iconColors[color as keyof typeof iconColors]} p-3`}
        >
          <Icon className="h-6 w-6 text-white" />
        </motion.div>
      </div>
    </GlassCard>
  );
}