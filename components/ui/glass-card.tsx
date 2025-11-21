"use client";

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export function GlassCard({ 
  children, 
  className, 
  hover = true, 
  gradient = false 
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/20 backdrop-blur-lg",
        gradient 
          ? "bg-gradient-to-br from-white/10 to-white/5 dark:from-white/5 dark:to-white/2" 
          : "bg-white/10 dark:bg-white/5",
        "shadow-lg hover:shadow-xl transition-shadow duration-300",
        className
      )}
    >
      {/* Gradient overlay for extra depth */}
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/5 to-pink-400/10 dark:from-blue-400/5 dark:via-purple-400/2 dark:to-pink-400/5" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}