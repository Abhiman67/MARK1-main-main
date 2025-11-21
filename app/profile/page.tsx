"use client";

import { useState, useRef, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  GraduationCap,
  Target,
  Star,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Calendar,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Camera,
  Shield,
  Bell,
  Palette,
  Upload
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editing states for different sections
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Senior Software Engineer',
    bio: 'Passionate software engineer with 5+ years of experience in full-stack development. Love building scalable applications and mentoring junior developers.',
    website: 'https://johndoe.dev',
    github: 'johndoe',
    linkedin: 'john-doe-dev',
    twitter: 'johndoe_dev',
  });

  const [tempProfile, setTempProfile] = useState(profile);

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      startDate: '2021-01',
      endDate: '',
      current: true,
      description: 'Lead development of microservices architecture serving 1M+ users. Improved application performance by 40% through optimization.',
    },
    {
      id: '2',
      title: 'Software Engineer',
      company: 'StartupXYZ',
      location: 'San Francisco, CA',
      startDate: '2019-06',
      endDate: '2021-01',
      current: false,
      description: 'Built full-stack web applications using React and Node.js. Collaborated with design team to implement responsive UI components.',
    },
  ]);

  const [education, setEducation] = useState<Education[]>([
    {
      id: '1',
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      startDate: '2015-08',
      endDate: '2019-05',
      gpa: '3.8',
    },
  ]);

  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: 'React', level: 90, category: 'Frontend' },
    { id: '2', name: 'TypeScript', level: 85, category: 'Frontend' },
    { id: '3', name: 'Node.js', level: 80, category: 'Backend' },
    { id: '4', name: 'PostgreSQL', level: 75, category: 'Database' },
    { id: '5', name: 'AWS', level: 70, category: 'Cloud' },
    { id: '6', name: 'Docker', level: 65, category: 'DevOps' },
  ]);

  const [goals, setGoals] = useState([
    { id: '1', title: 'Learn System Design', target: 'Complete by Q2 2024', progress: 60 },
    { id: '2', title: 'Master React Native', target: 'Build 2 mobile apps', progress: 30 },
    { id: '3', title: 'Contribute to Open Source', target: '10 meaningful contributions', progress: 80 },
  ]);

  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        toast.success('Avatar updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (field: string, value: string) => {
    setTempProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!tempProfile.firstName.trim() || !tempProfile.lastName.trim()) {
      toast.error('First name and last name are required');
      return;
    }
    if (!tempProfile.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempProfile.email)) {
      toast.error('Valid email is required');
      return;
    }

    setProfile(tempProfile);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
    toast('Changes discarded', { icon: 'ℹ️' });
  };

  const handleEditMode = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const deleteExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
    toast.success('Experience deleted');
  };

  const deleteEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
    toast.success('Education deleted');
  };

  const deleteSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
    toast.success('Skill removed');
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
    toast.success('Goal deleted');
  };

  const updateSkillLevel = (id: string, newLevel: number) => {
    setSkills(skills.map(skill => 
      skill.id === id ? { ...skill, level: newLevel } : skill
    ));
    toast.success('Skill level updated');
  };

  const updateGoalProgress = (id: string, newProgress: number) => {
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, progress: newProgress } : goal
    ));
    toast.success('Goal progress updated');
  };

  // Edit handlers for experiences
  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setExperiences(experiences.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const saveExperience = (id: string) => {
    setEditingExpId(null);
    toast.success('Experience updated');
  };

  // Edit handlers for education
  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setEducation(education.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const saveEducation = (id: string) => {
    setEditingEduId(null);
    toast.success('Education updated');
  };

  // Edit handlers for skills
  const updateSkillName = (id: string, field: keyof Skill, value: any) => {
    setSkills(skills.map(skill =>
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  const saveSkill = (id: string) => {
    setEditingSkillId(null);
    toast.success('Skill updated');
  };

  // Edit handlers for goals
  const updateGoal = (id: string, field: string, value: any) => {
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, [field]: value } : goal
    ));
  };

  const saveGoal = (id: string) => {
    setEditingGoalId(null);
    toast.success('Goal updated');
  };

  // Inline render functions for each item type
  const renderExperience = (exp: Experience, index: number) => {
    const isEditing = editingExpId === exp.id;
    
    if (isEditing) {
      return (
        <motion.div
          key={exp.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Job Title</Label>
              <Input
                value={exp.title}
                onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                className="bg-white/10 border-white/20"
              />
            </div>
            <div>
              <Label>Company</Label>
              <Input
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                className="bg-white/10 border-white/20"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Location</Label>
              <Input
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                className="bg-white/10 border-white/20"
              />
            </div>
            <div>
              <Label>Start Date</Label>
              <Input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                className="bg-white/10 border-white/20"
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="month"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                disabled={exp.current}
                className="bg-white/10 border-white/20"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={exp.current}
              onCheckedChange={(checked) => updateExperience(exp.id, 'current', checked)}
            />
            <Label>Currently working here</Label>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
              rows={3}
              className="bg-white/10 border-white/20"
            />
          </div>
          <div className="flex space-x-2 justify-end">
            <Button size="sm" onClick={() => saveExperience(exp.id)} className="bg-green-500 hover:bg-green-600">
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditingExpId(null)}>
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={exp.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 + index * 0.1 }}
        className="p-4 rounded-lg bg-white/5 border border-white/10"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h4 className="font-semibold">{exp.title}</h4>
              {exp.current && (
                <Badge variant="secondary" className="bg-green-500/20 text-green-500 animate-pulse">
                  Current
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mb-1">{exp.company}</p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{exp.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
            </div>
            <p className="text-sm">{exp.description}</p>
          </div>
          <div className="flex space-x-2">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button size="sm" variant="ghost" onClick={() => setEditingExpId(exp.id)} className="hover:bg-blue-500/10">
                <Edit3 className="h-3 w-3" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => deleteExperience(exp.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderEducation = (edu: Education, index: number) => {
    const isEditing = editingEduId === edu.id;
    
    if (isEditing) {
      return (
        <motion.div
          key={edu.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Degree</Label>
              <Input
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                className="bg-white/10 border-white/20"
              />
            </div>
            <div>
              <Label>School</Label>
              <Input
                value={edu.school}
                onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                className="bg-white/10 border-white/20"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Location</Label>
              <Input
                value={edu.location}
                onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                className="bg-white/10 border-white/20"
              />
            </div>
            <div>
              <Label>Start Date</Label>
              <Input
                type="month"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                className="bg-white/10 border-white/20"
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="month"
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                className="bg-white/10 border-white/20"
              />
            </div>
          </div>
          <div>
            <Label>GPA (optional)</Label>
            <Input
              value={edu.gpa || ''}
              onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
              placeholder="e.g., 3.8"
              className="bg-white/10 border-white/20"
            />
          </div>
          <div className="flex space-x-2 justify-end">
            <Button size="sm" onClick={() => saveEducation(edu.id)} className="bg-green-500 hover:bg-green-600">
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditingEduId(null)}>
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={edu.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 + index * 0.1 }}
        className="p-4 rounded-lg bg-white/5 border border-white/10"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold mb-1">{edu.degree}</h4>
            <p className="text-muted-foreground mb-1">{edu.school}</p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{edu.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{edu.startDate} - {edu.endDate}</span>
              </div>
            </div>
            {edu.gpa && <p className="text-sm font-medium">GPA: {edu.gpa}</p>}
          </div>
          <div className="flex space-x-2">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button size="sm" variant="ghost" onClick={() => setEditingEduId(edu.id)} className="hover:bg-blue-500/10">
                <Edit3 className="h-3 w-3" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => deleteEducation(edu.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderSkill = (skill: Skill) => {
    const isEditing = editingSkillId === skill.id;
    
    if (isEditing) {
      return (
        <motion.div
          key={skill.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Skill Name</Label>
              <Input
                value={skill.name}
                onChange={(e) => updateSkillName(skill.id, 'name', e.target.value)}
                className="bg-white/10 border-white/20"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                value={skill.category}
                onChange={(e) => updateSkillName(skill.id, 'category', e.target.value)}
                className="bg-white/10 border-white/20"
              />
            </div>
          </div>
          <div>
            <Label>Skill Level: {skill.level}%</Label>
            <input
              type="range"
              min="0"
              max="100"
              value={skill.level}
              onChange={(e) => updateSkillName(skill.id, 'level', parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
          <div className="flex space-x-2 justify-end">
            <Button size="sm" onClick={() => saveSkill(skill.id)} className="bg-green-500 hover:bg-green-600">
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditingSkillId(null)}>
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={skill.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-3 rounded-lg bg-white/5 border border-white/10"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{skill.name}</span>
            <Badge variant="outline" className="text-xs">{skill.category}</Badge>
          </div>
          <div className="flex space-x-1">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button size="sm" variant="ghost" onClick={() => setEditingSkillId(skill.id)} className="hover:bg-blue-500/10 h-7 w-7 p-0">
                <Edit3 className="h-3 w-3" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-7 w-7 p-0" onClick={() => deleteSkill(skill.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </motion.div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Proficiency</span>
            <span>{skill.level}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${skill.level}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    );
  };

  const renderGoal = (goal: Goal) => {
    const isEditing = editingGoalId === goal.id;
    
    if (isEditing) {
      return (
        <motion.div
          key={goal.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3"
        >
          <div>
            <Label>Goal Title</Label>
            <Input
              value={goal.title}
              onChange={(e) => updateGoal(goal.id, 'title', e.target.value)}
              className="bg-white/10 border-white/20"
            />
          </div>
          <div>
            <Label>Target Description</Label>
            <Textarea
              value={goal.target}
              onChange={(e) => updateGoal(goal.id, 'target', e.target.value)}
              rows={2}
              className="bg-white/10 border-white/20"
            />
          </div>
          <div>
            <Label>Progress: {goal.progress}%</Label>
            <input
              type="range"
              min="0"
              max="100"
              value={goal.progress}
              onChange={(e) => updateGoal(goal.id, 'progress', parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
          <div className="flex space-x-2 justify-end">
            <Button size="sm" onClick={() => saveGoal(goal.id)} className="bg-green-500 hover:bg-green-600">
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditingGoalId(null)}>
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={goal.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-lg bg-white/5 border border-white/10"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Target className="h-4 w-4 text-purple-500" />
            </div>
            <div>
              <h4 className="font-semibold">{goal.title}</h4>
              <p className="text-sm text-muted-foreground">{goal.target}</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button size="sm" variant="ghost" onClick={() => setEditingGoalId(goal.id)} className="hover:bg-blue-500/10 h-7 w-7 p-0">
                <Edit3 className="h-3 w-3" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-7 w-7 p-0" onClick={() => deleteGoal(goal.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </motion.div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span className="font-medium">{goal.progress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${goal.progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    );
  };

  const displayProfile = isEditing ? tempProfile : profile;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <GlassCard className="p-6" gradient>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-6">
                <div className="relative group">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Avatar className="h-24 w-24 ring-2 ring-white/20">
                      <AvatarImage src={avatarUrl || "/avatars/john-doe.jpg"} alt="Profile" />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {displayProfile.firstName[0]}{displayProfile.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8 bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group-hover:scale-110"
                  >
                    <Camera className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold">
                      {displayProfile.firstName} {displayProfile.lastName}
                    </h1>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-500 animate-pulse">
                      Active
                    </Badge>
                  </div>
                  <p className="text-lg text-muted-foreground mb-2">{displayProfile.title}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{displayProfile.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>{displayProfile.email}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="sm" onClick={handleSave} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="sm" onClick={handleEditMode} className="bg-gradient-to-r from-blue-500 to-purple-600">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-white/10 mb-8">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <GlassCard className="p-6" gradient>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={displayProfile.firstName}
                          onChange={(e) => handleProfileChange('firstName', e.target.value)}
                          disabled={!isEditing}
                          className="bg-white/10 border-white/20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={displayProfile.lastName}
                          onChange={(e) => handleProfileChange('lastName', e.target.value)}
                          disabled={!isEditing}
                          className="bg-white/10 border-white/20"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={displayProfile.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        disabled={!isEditing}
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={displayProfile.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={displayProfile.location}
                        onChange={(e) => handleProfileChange('location', e.target.value)}
                        disabled={!isEditing}
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Professional Title</Label>
                      <Input
                        id="title"
                        value={displayProfile.title}
                        onChange={(e) => handleProfileChange('title', e.target.value)}
                        disabled={!isEditing}
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={displayProfile.bio}
                        onChange={(e) => handleProfileChange('bio', e.target.value)}
                        disabled={!isEditing}
                        rows={4}
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <GlassCard className="p-6" gradient>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Social Links
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={displayProfile.website}
                        onChange={(e) => handleProfileChange('website', e.target.value)}
                        disabled={!isEditing}
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="github">GitHub</Label>
                      <div className="flex items-center space-x-2">
                        <Github className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="github"
                          value={displayProfile.github}
                          onChange={(e) => handleProfileChange('github', e.target.value)}
                          disabled={!isEditing}
                          className="bg-white/10 border-white/20"
                          placeholder="username"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <div className="flex items-center space-x-2">
                        <Linkedin className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="linkedin"
                          value={displayProfile.linkedin}
                          onChange={(e) => handleProfileChange('linkedin', e.target.value)}
                          disabled={!isEditing}
                          className="bg-white/10 border-white/20"
                          placeholder="username"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="twitter">Twitter</Label>
                      <div className="flex items-center space-x-2">
                        <Twitter className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="twitter"
                          value={displayProfile.twitter}
                          onChange={(e) => handleProfileChange('twitter', e.target.value)}
                          disabled={!isEditing}
                          className="bg-white/10 border-white/20"
                          placeholder="username"
                        />
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Career Goals */}
                <GlassCard className="p-6 mt-6" gradient>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Career Goals
                  </h3>
                  <div className="space-y-3">
                    {goals.map((goal) => (
                      <div key={goal.id} className="p-3 rounded-lg bg-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{goal.title}</h4>
                          <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{goal.target}</p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Account Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <GlassCard className="p-6" gradient>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Account Settings
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
                      Update Password
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Preferences */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <GlassCard className="p-6" gradient>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Preferences
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="theme">Theme</Label>
                      <Select defaultValue="system">
                        <SelectTrigger className="bg-white/10 border-white/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger className="bg-white/10 border-white/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="pst">
                        <SelectTrigger className="bg-white/10 border-white/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pst">Pacific Standard Time</SelectItem>
                          <SelectItem value="est">Eastern Standard Time</SelectItem>
                          <SelectItem value="cst">Central Standard Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </GlassCard>

                {/* Notifications */}
                <GlassCard className="p-6 mt-6" gradient>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <Switch id="emailNotifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="pushNotifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                      </div>
                      <Switch id="pushNotifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weeklyDigest">Weekly Digest</Label>
                        <p className="text-sm text-muted-foreground">Weekly progress summary</p>
                      </div>
                      <Switch id="weeklyDigest" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="goalReminders">Goal Reminders</Label>
                        <p className="text-sm text-muted-foreground">Reminders for goal deadlines</p>
                      </div>
                      <Switch id="goalReminders" defaultChecked />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}