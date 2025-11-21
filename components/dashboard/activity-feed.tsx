"use client";

import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { 
  MessageSquare, 
  FileText, 
  Trophy, 
  Target,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Activity {
  id: string;
  type: 'chat' | 'resume' | 'achievement' | 'goal' | 'completion' | 'progress';
  title: string;
  description: string;
  timestamp: Date;
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'chat',
    title: 'AI Coaching Session',
    description: 'Discussed career transition strategies',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: '2',
    type: 'resume',
    title: 'Resume Updated',
    description: 'Added new project to experience section',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: '3',
    type: 'achievement',
    title: 'Achievement Unlocked',
    description: 'Completed Frontend Development roadmap',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
  },
  {
    id: '4',
    type: 'goal',
    title: 'Goal Set',
    description: 'Learn React Native in 3 months',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
  },
  {
    id: '5',
    type: 'completion',
    title: 'Course Completed',
    description: 'TypeScript Advanced Concepts',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: '6',
    type: 'progress',
    title: 'Progress Update',
    description: 'Backend Development roadmap 75% complete',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
  },
];

const activityIcons = {
  chat: MessageSquare,
  resume: FileText,
  achievement: Trophy,
  goal: Target,
  completion: CheckCircle,
  progress: TrendingUp,
};

const activityColors = {
  chat: 'text-blue-500',
  resume: 'text-purple-500',
  achievement: 'text-yellow-500',
  goal: 'text-green-500',
  completion: 'text-emerald-500',
  progress: 'text-orange-500',
};

export function ActivityFeed() {
  return (
    <GlassCard className="p-6" gradient>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          View all
        </motion.button>
      </div>
      
      <ScrollArea className="h-96">
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className={`rounded-full p-2 ${colorClass} bg-current/10`}>
                  <Icon className={`h-4 w-4 ${colorClass}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>
    </GlassCard>
  );
}