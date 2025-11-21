"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Award,
  MessageSquare,
  FileText,
  Plus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { StatsCard } from '@/components/dashboard/stats-card';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import type { Resume } from '@/hooks/useATSScore';

const quickActions = [
  {
    title: 'Chat with AI Coach',
    description: 'Get personalized career advice',
    icon: MessageSquare,
    href: '/coach',
    color: 'blue',
  },
  {
    title: 'Update Resume',
    description: 'Improve your resume with AI',
    icon: FileText,
    href: '/resume',
    color: 'purple',
  },
];

const STORAGE_KEY = 'resume:list';

export default function Dashboard() {
  const [resumeStats, setResumeStats] = useState<{
    totalResumes: number;
    avgAtsScore: number;
    totalSkills: number;
    lastUpdated: string;
  }>({
    totalResumes: 0,
    avgAtsScore: 0,
    totalSkills: 0,
    lastUpdated: 'Never',
  });

  useEffect(() => {
    // Load resume data from localStorage
    const loadResumeStats = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const resumes: Resume[] = JSON.parse(stored);
          if (resumes.length > 0) {
            const totalAts = resumes.reduce((sum, r) => sum + (r.atsScore || 0), 0);
            const avgAts = Math.round(totalAts / resumes.length);
            const allSkills = new Set(resumes.flatMap(r => r.skills));
            const lastMod = resumes.reduce((latest, r) => {
              const date = r.lastModified ? new Date(r.lastModified) : new Date(0);
              return date > latest ? date : latest;
            }, new Date(0));

            setResumeStats({
              totalResumes: resumes.length,
              avgAtsScore: avgAts,
              totalSkills: allSkills.size,
              lastUpdated: lastMod.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              }),
            });
          }
        }
      } catch (error) {
        console.error('Error loading resume stats:', error);
      }
    };

    loadResumeStats();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Welcome! 👋</h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your career journey today.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatsCard
            title="Total Resumes"
            value={resumeStats.totalResumes.toString()}
            change={`Last updated ${resumeStats.lastUpdated}`}
            changeType="positive"
            icon={FileText}
            color="blue"
          />
          <StatsCard
            title="Avg ATS Score"
            value={`${resumeStats.avgAtsScore}%`}
            change={resumeStats.avgAtsScore >= 70 ? 'Excellent!' : 'Keep improving'}
            changeType={resumeStats.avgAtsScore >= 70 ? 'positive' : 'neutral'}
            icon={Target}
            color="green"
          />
          <StatsCard
            title="Skills Listed"
            value={resumeStats.totalSkills.toString()}
            change="Across all resumes"
            changeType="positive"
            icon={Award}
            color="purple"
          />
          <StatsCard
            title="AI Coach Sessions"
            value="12"
            change="+3 this week"
            changeType="positive"
            icon={MessageSquare}
            color="orange"
          />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard className="p-6" gradient>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Quick Actions</h3>
                <Plus className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link key={action.title} href={action.href}>
                    <motion.div
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className={`rounded-full p-2 bg-${action.color}-500/20`}>
                        <action.icon className={`h-4 w-4 text-${action.color}-500`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{action.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Resume Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlassCard className="p-6" gradient>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Resume Quality</h3>
                <Link href="/resume">
                  <Button variant="ghost" size="sm">
                    View all
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">ATS Score</span>
                    {resumeStats.avgAtsScore >= 80 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold">{resumeStats.avgAtsScore}%</span>
                    <Progress value={resumeStats.avgAtsScore} className="flex-1" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {resumeStats.avgAtsScore >= 80 
                      ? 'Excellent! Your resume is optimized for ATS systems.'
                      : 'Keep improving your resume to reach 80%+ score.'}
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Skills Coverage</span>
                    <Target className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold">{resumeStats.totalSkills}</span>
                    <span className="text-sm text-muted-foreground">skills listed</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {resumeStats.totalSkills >= 10
                      ? 'Great variety of skills across your resumes.'
                      : 'Consider adding more relevant skills to your resume.'}
                  </p>
                </div>

                <Link href="/resume">
                  <Button className="w-full" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Improve Your Resume
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </div>
  );
}