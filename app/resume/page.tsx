"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Eye, 
  Edit3, 
  Plus,
  Trash2,
  Copy,
  Star,
  Zap,
  CheckCircle,
  AlertCircle,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Settings,
  Code,
  Languages,
  Link as LinkIcon,
  ExternalLink,
  Globe,
  ChevronDown,
  Clock,
  History,
  RotateCcw,
  Check,
  Upload
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectTrigger, 
  SelectContent, 
  SelectItem, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { saveAs } from 'file-saver';
import { ResumeTemplate, type ResumeData, type TemplateType } from '@/components/resume/templates';
import { SkillsTagInput } from '@/components/resume/SkillsTagInput';
import { DateInput } from '@/components/resume/DateInput';
import { AchievementList } from '@/components/resume/AchievementList';
import { TemplatePreviewModal } from '@/components/resume/TemplatePreviewModal';
import { ATSScoreBadge, FloatingATSScoreBadge } from '@/components/resume/ATSScoreBadge';
import { OnboardingWizard } from '@/components/resume/OnboardingWizard';
import { VersionHistoryImproved } from '@/components/resume/VersionHistoryImproved';
import { SectionOrderManager, type SectionConfig } from '@/components/resume/SectionOrderManager';
import { ThemeCustomizer, type ThemeCustomization } from '@/components/resume/ThemeCustomizer';
import { AwardsEditor } from '@/components/resume/AwardsEditor';
import { VolunteerEditor } from '@/components/resume/VolunteerEditor';
import { ProjectsEditor } from '@/components/resume/ProjectsEditor';
import { CertificationsEditor } from '@/components/resume/CertificationsEditor';
import { LanguagesEditor } from '@/components/resume/LanguagesEditor';
import { LinksEditor } from '@/components/resume/LinksEditor';
import { useAISuggestions } from '@/hooks/useAISuggestions';
import { AISuggestionsPanel } from '@/components/resume/AISuggestionsPanel';
import { validateEmail, validatePhone, validateUrl, formatDateSafe, sanitizeFilename } from '@/lib/validation';
import { InputError } from '@/components/ui/input-error';
import { ResumeImportModal } from '@/components/resume/ResumeImportModal';
import type { ImportedResumeData } from '@/lib/resume-import';

// Data Models
interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  link?: string;
}

interface Language {
  id: string;
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';
}

interface PortfolioLink {
  id: string;
  type: 'GitHub' | 'LinkedIn' | 'Portfolio' | 'Website' | 'Other';
  url: string;
  label?: string;
}

interface ResumeVersion {
  id: string;
  timestamp: Date;
  label: string;
  data: {
    personalInfo: PersonalInfo;
    summary: string;
    skills: string[];
    experience: Experience[];
    education: Education[];
    projects: Project[];
    certifications: Certification[];
    languages: Language[];
    links: PortfolioLink[];
  };
}

interface Resume {
  id: string;
  name: string;
  template: 'modern' | 'classic' | 'creative' | 'executive' | 'academic' | 'technical';
  lastModified: Date;
  atsScore: number;
  isDefault: boolean;
  personalInfo: PersonalInfo;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  links: PortfolioLink[];
  awards: Award[];
  volunteer: VolunteerExperience[];
  versions: ResumeVersion[];
}

interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

interface VolunteerExperience {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

const STORAGE_KEY = 'resume:list';

const initialResumes: Resume[] = [
  {
    id: '1',
    name: 'Software Engineer Resume',
    template: 'modern',
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 2),
    atsScore: 85,
    isDefault: true,
    personalInfo: {
      fullName: 'John Doe',
      email: 'john.doe@email.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA',
      title: 'Senior Software Engineer',
    },
    summary: 'Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable applications and leading cross-functional teams.',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker', 'Git'],
    experience: [
      {
        id: 'exp1',
        company: 'Tech Company Inc.',
        position: 'Senior Software Engineer',
        startDate: '2021-01',
        endDate: '',
        current: true,
        description: 'Leading development of cloud-based microservices platform',
        achievements: [
          'Led development of microservices architecture serving 1M+ users',
          'Improved application performance by 40% through optimization',
          'Mentored 3 junior developers and conducted code reviews',
        ],
      },
      {
        id: 'exp2',
        company: 'Startup XYZ',
        position: 'Full Stack Developer',
        startDate: '2019-06',
        endDate: '2020-12',
        current: false,
        description: 'Built web applications using React and Node.js',
        achievements: [
          'Developed 5+ client-facing web applications',
          'Reduced page load time by 60% through optimization',
          'Implemented CI/CD pipeline reducing deployment time by 50%',
        ],
      },
    ],
    education: [
      {
        id: 'edu1',
        institution: 'University of California',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2015-09',
        endDate: '2019-05',
        gpa: '3.8',
      },
    ],
    projects: [],
    certifications: [],
    languages: [],
    links: [],
    awards: [],
    volunteer: [],
    versions: [],
  },
  {
    id: '2',
    name: 'Full Stack Developer',
    template: 'classic',
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24),
    atsScore: 78,
    isDefault: false,
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      title: '',
    },
    summary: '',
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
    links: [],
    awards: [],
    volunteer: [],
    versions: [],
  },
  {
    id: '3',
    name: 'Frontend Specialist',
    template: 'creative',
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 48),
    atsScore: 92,
    isDefault: false,
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      title: '',
    },
    summary: '',
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
    links: [],
    awards: [],
    volunteer: [],
    versions: [],
  },
];

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design',
    preview: '/templates/modern.jpg',
    color: 'blue',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional professional layout',
    preview: '/templates/classic.jpg',
    color: 'gray',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and eye-catching design',
    preview: '/templates/creative.jpg',
    color: 'purple',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated layout for senior roles',
    preview: '/templates/executive.jpg',
    color: 'slate',
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Perfect for research and academia',
    preview: '/templates/academic.jpg',
    color: 'emerald',
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Optimized for developers and engineers',
    preview: '/templates/technical.jpg',
    color: 'cyan',
  },
];

// --- ATS analysis helpers (top-level, pure) ---
const KEYWORDS = [
  'react', 'typescript', 'node', 'node.js', 'javascript', 'python', 'aws', 'sql', 'java', 'docker'
];

const computeATSScore = (r: Resume) => {
  if (!r) return 0;
  let score = 50; // baseline

  // Contact completeness
  const contactFields = [r.personalInfo.fullName, r.personalInfo.email, r.personalInfo.phone, r.personalInfo.title];
  const contactComplete = contactFields.filter(Boolean).length;
  score += Math.min(10, contactComplete * 3);

  // Summary length
  if ((r.summary || '').trim().length > 60) score += 8;

  // Skills count
  score += Math.min(15, (r.skills?.length || 0) * 2);

  // Quantified achievements detection
  const quantified = r.experience.reduce((acc, exp) => {
    const q = exp.achievements.filter(a => /\d+%|\d+\s?(people|users|customers|sales)|\b\d+\b/.test(a)).length;
    return acc + q;
  }, 0);
  score += Math.min(15, quantified * 5);

  // Keyword matching
  const text = [r.summary, ...r.experience.map(e => e.description + ' ' + e.achievements.join(' ')), r.skills.join(' ')].join(' ').toLowerCase();
  let keywordMatches = 0;
  KEYWORDS.forEach(k => { if (text.includes(k)) keywordMatches++; });
  score += Math.min(10, keywordMatches * 2);

  // NEW: Projects bonus
  if (r.projects && r.projects.length > 0) score += 5;

  // NEW: Certifications bonus
  if (r.certifications && r.certifications.length > 0) score += 10;

  // NEW: Languages bonus
  if (r.languages && r.languages.length > 0) score += Math.min(5, r.languages.length * 2);

  // NEW: Portfolio/GitHub links bonus
  if (r.links && r.links.length > 0) {
    const hasGithub = r.links.some(link => link.type === 'GitHub');
    const hasLinkedIn = r.links.some(link => link.type === 'LinkedIn');
    if (hasGithub) score += 5;
    if (hasLinkedIn) score += 3;
  }

  // Clamp
  score = Math.max(10, Math.min(95, Math.round(score)));
  return score;
};

export default function ResumePage() {
  // Stable initial state used for both SSR and first client render to avoid hydration mismatch.
  const [resumesList, setResumesList] = useState<Resume[]>(initialResumes);
  const [selectedId, setSelectedId] = useState<string | null>(initialResumes[0]?.id || null);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isBuilding, setIsBuilding] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isNewResumeOpen, setIsNewResumeOpen] = useState(false);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [skillsInput, setSkillsInput] = useState('');
  const lastAnalyzedId = useRef<string | null>(null);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  // AI Suggestion Modal States
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [newAchievement, setNewAchievement] = useState('');
  const [isKeywordModalOpen, setIsKeywordModalOpen] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [summaryInput, setSummaryInput] = useState('');
  
  // New UX enhancement states
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isTemplatePreviewOpen, setIsTemplatePreviewOpen] = useState(false);
  const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false);
  const [showFloatingATS, setShowFloatingATS] = useState(false);
  const [sectionOrder, setSectionOrder] = useState<SectionConfig[]>([
    { id: 'summary', label: 'Professional Summary', visible: true, order: 0 },
    { id: 'experience', label: 'Work Experience', visible: true, order: 1 },
    { id: 'education', label: 'Education', visible: true, order: 2 },
    { id: 'skills', label: 'Skills', visible: true, order: 3 },
    { id: 'projects', label: 'Projects', visible: true, order: 4 },
    { id: 'certifications', label: 'Certifications', visible: true, order: 5 },
    { id: 'languages', label: 'Languages', visible: true, order: 6 },
    { id: 'links', label: 'Links', visible: true, order: 7 },
  ]);
  const [themeCustomization, setThemeCustomization] = useState<ThemeCustomization>({
    primaryColor: '#3B82F6',
    accentColor: '#8B5CF6',
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 1.6,
    sectionSpacing: 24,
    margins: 48,
  });
  
  // Check for first-time users (show onboarding)
  useEffect(() => {
    if (mounted && resumesList.length === 1 && !localStorage.getItem('resume:onboarding-seen')) {
      setIsOnboardingOpen(true);
      localStorage.setItem('resume:onboarding-seen', 'true');
    }
  }, [mounted, resumesList.length]);

  // After mount, hydrate any locally persisted resumes; defer changes until mounted to keep SSR markup identical.
  useEffect(() => {
    setMounted(true);
    try {
      // Load resumes
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Array<Omit<Resume, 'lastModified' | 'versions'> & { 
          lastModified: string;
          versions?: Array<Omit<ResumeVersion, 'timestamp'> & { timestamp: string }>;
        }>;
        const list: Resume[] = parsed.map((r) => ({ 
          ...r, 
          lastModified: new Date(r.lastModified),
          // Initialize new fields for existing resumes
          projects: r.projects || [],
          certifications: r.certifications || [],
          languages: r.languages || [],
          links: r.links || [],
          versions: (r.versions || []).map(v => ({ 
            ...v, 
            timestamp: typeof v.timestamp === 'string' ? new Date(v.timestamp) : v.timestamp 
          }))
        }));
        if (list.length) {
          setResumesList(list);
          setSelectedId(list[0].id);
        }
      }
      
      // Load saved theme customization
      const savedTheme = localStorage.getItem('resume:theme');
      if (savedTheme) {
        try {
          setThemeCustomization(JSON.parse(savedTheme));
        } catch {}
      }
    } catch {/* ignore */}
  }, []);

  const selectedResume = resumesList.find((r) => r.id === selectedId) || null;

  // Sync skills input with selected resume
  useEffect(() => {
    if (selectedResume) {
      setSkillsInput(selectedResume.skills.join(', '));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedResume?.id]); // Only update when resume changes, not on every render

  const persistTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const saveStatusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const persist = useCallback((list: Resume[]) => {
    setResumesList(list);
    setSaveStatus('saving');
    
    // Debounce localStorage writes to prevent blocking UI
    if (persistTimeoutRef.current) {
      clearTimeout(persistTimeoutRef.current);
    }
    
    persistTimeoutRef.current = setTimeout(() => {
      // Use requestIdleCallback for non-blocking saves
      const saveToStorage = () => {
        try {
          const data = JSON.stringify(list.map((r) => ({ 
            ...r, 
            lastModified: r.lastModified.toISOString(),
            versions: (r.versions || []).map(v => ({
              ...v,
              timestamp: v.timestamp.toISOString()
            }))
          })));
          localStorage.setItem(STORAGE_KEY, data);
          setSaveStatus('saved');
          
          // Reset to idle after 2 seconds
          if (saveStatusTimeoutRef.current) {
            clearTimeout(saveStatusTimeoutRef.current);
          }
          saveStatusTimeoutRef.current = setTimeout(() => {
            setSaveStatus('idle');
          }, 2000);
        } catch (error) {
          console.error('Failed to save:', error);
          setSaveStatus('error');
          // Reset to idle after 3 seconds on error
          if (saveStatusTimeoutRef.current) {
            clearTimeout(saveStatusTimeoutRef.current);
          }
          saveStatusTimeoutRef.current = setTimeout(() => {
            setSaveStatus('idle');
          }, 3000);
        }
      };
      
      // Use requestIdleCallback if available, otherwise fallback to immediate
      if ('requestIdleCallback' in window) {
        requestIdleCallback(saveToStorage, { timeout: 2000 });
      } else {
        saveToStorage();
      }
    }, 1000); // Wait 1 second after last change
  }, []);

  // Cleanup timeout on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (persistTimeoutRef.current) {
        clearTimeout(persistTimeoutRef.current);
      }
      if (saveStatusTimeoutRef.current) {
        clearTimeout(saveStatusTimeoutRef.current);
      }
    };
  }, []);

  // Flush pending saves before page unload to prevent data loss
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (persistTimeoutRef.current) {
        clearTimeout(persistTimeoutRef.current);
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(resumesList.map((r) => ({ 
              ...r, 
              lastModified: r.lastModified.toISOString(),
              versions: (r.versions || []).map(v => ({
                ...v,
                timestamp: v.timestamp.toISOString()
              }))
            })))
          );
        } catch {}
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [resumesList]);

  const saveVersion = useCallback((resume: Resume, label: string = 'Manual Save') => {
    const newVersion: ResumeVersion = {
      id: `v-${Date.now()}`,
      timestamp: new Date(),
      label,
      data: {
        personalInfo: JSON.parse(JSON.stringify(resume.personalInfo)),
        summary: resume.summary,
        skills: [...resume.skills],
        experience: JSON.parse(JSON.stringify(resume.experience)),
        education: JSON.parse(JSON.stringify(resume.education)),
        projects: JSON.parse(JSON.stringify(resume.projects)),
        certifications: JSON.parse(JSON.stringify(resume.certifications)),
        languages: JSON.parse(JSON.stringify(resume.languages)),
        links: JSON.parse(JSON.stringify(resume.links)),
      },
    };

    const updatedVersions = [...(resume.versions || []), newVersion].slice(-10); // Keep last 10 versions
    const updated = resumesList.map(r => 
      r.id === resume.id ? { ...r, versions: updatedVersions, lastModified: new Date() } : r
    );
    persist(updated);
    return newVersion.id;
  }, [resumesList, persist]);

  const restoreVersion = useCallback((versionId: string) => {
    if (!selectedResume) return;
    
    const version = selectedResume.versions.find(v => v.id === versionId);
    if (!version) return;

    const updated = resumesList.map(r => {
      if (r.id === selectedResume.id) {
        return {
          ...r,
          ...version.data,
          lastModified: new Date(),
        };
      }
      return r;
    });
    persist(updated);
    setIsVersionHistoryOpen(false);
  }, [selectedResume, resumesList, persist]);

  const createResume = (template: Resume['template']) => {
    const newResume: Resume = {
      id: Date.now().toString(),
      name: 'Untitled Resume',
      template,
      lastModified: new Date(),
      atsScore: 70,
      isDefault: resumesList.length === 0,
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        title: '',
      },
      summary: '',
      skills: [],
      experience: [],
      education: [],
      projects: [],
      certifications: [],
      languages: [],
      links: [],
      awards: [],
      volunteer: [],
      versions: [],
    };
    const list = [...resumesList, newResume];
    persist(list);
    setSelectedId(newResume.id);
  };

  // Import resume handler
  const handleImportResume = (data: ImportedResumeData) => {
    const newResume: Resume = {
      id: crypto.randomUUID(),
      name: data.personalInfo.fullName ? `${data.personalInfo.fullName}'s Resume` : 'Imported Resume',
      template: 'modern',
      lastModified: new Date(),
      atsScore: 50,
      isDefault: resumesList.length === 0,
      personalInfo: {
        fullName: data.personalInfo.fullName || '',
        email: data.personalInfo.email || '',
        phone: data.personalInfo.phone || '',
        location: data.personalInfo.location || '',
        title: data.personalInfo.title || '',
      },
      summary: data.summary || '',
      skills: data.skills,
      experience: data.experience.map(exp => ({
        ...exp,
        id: crypto.randomUUID(),
        current: false,
      })),
      education: data.education.map(edu => ({
        ...edu,
        id: crypto.randomUUID(),
        gpa: edu.gpa || '',
      })),
      projects: data.projects.map(proj => ({
        ...proj,
        id: crypto.randomUUID(),
        startDate: '',
        endDate: '',
        current: false,
        highlights: [],
      })),
      certifications: data.certifications.map(cert => ({
        ...cert,
        id: crypto.randomUUID(),
        expiryDate: undefined,
        credentialId: undefined,
        link: undefined,
      })),
      languages: data.languages.map(lang => ({
        id: crypto.randomUUID(),
        name: lang.language,
        proficiency: (['Native', 'Fluent', 'Professional', 'Intermediate', 'Basic'].includes(lang.proficiency) 
          ? lang.proficiency 
          : 'Intermediate') as Language['proficiency'],
      })),
      links: data.links.map(link => ({
        id: crypto.randomUUID(),
        type: (['GitHub', 'LinkedIn', 'Portfolio', 'Website', 'Other'].includes(link.type) 
          ? link.type 
          : 'Other') as PortfolioLink['type'],
        url: link.url,
        label: undefined,
      })),
      awards: [],
      volunteer: [],
      versions: [],
    };
    const list = [...resumesList, newResume];
    persist(list);
    setSelectedId(newResume.id);
  };

  // Onboarding handler
  const handleOnboardingComplete = (data: {
    useTemplate: boolean;
    name: string;
    email: string;
    phone: string;
    title: string;
  }) => {
    if (data.useTemplate) {
      // User chose to see sample data - keep initial resumes
      return;
    } else {
      // Create new blank resume with basic info
      const newResume: Resume = {
        id: crypto.randomUUID(),
        name: `${data.name}'s Resume`,
        template: 'modern',
        lastModified: new Date(),
        atsScore: 50,
        isDefault: true,
        personalInfo: {
          fullName: data.name,
          email: data.email,
          phone: data.phone,
          location: '',
          title: data.title,
        },
        summary: '',
        skills: [],
        experience: [],
        education: [],
        projects: [],
        certifications: [],
        languages: [],
        links: [],
        awards: [],
        volunteer: [],
        versions: [],
      };
      persist([newResume]);
      setSelectedId(newResume.id);
    }
  };

  // Template change with preview
  const handleTemplateChange = (template: TemplateType) => {
    if (!selectedResume) return;
    updateResumeField('template', template);
  };

  // Theme customization handler
  const handleThemeChange = (theme: ThemeCustomization) => {
    setThemeCustomization(theme);
    // Optionally persist theme to localStorage
    localStorage.setItem('resume:theme', JSON.stringify(theme));
  };

  // Section order handler
  const handleSectionOrderChange = (newOrder: SectionConfig[]) => {
    setSectionOrder(newOrder);
    // Optionally persist to localStorage or resume data
    localStorage.setItem('resume:sectionOrder', JSON.stringify(newOrder));
  };

  // Skills array update (for new SkillsTagInput)
  const updateSkillsArray = (skills: string[]) => {
    if (!selectedResume) return;
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? { ...r, skills, lastModified: new Date() }
        : r
    );
    persist(updated);
  };

  const duplicateSelected = () => {
    if (!selectedResume) return;
    const copy: Resume = {
      ...selectedResume,
      id: crypto.randomUUID(),
      name: `${selectedResume.name} (Copy)`,
      lastModified: new Date(),
      isDefault: false,
    };
    persist([...resumesList, copy]);
    setSelectedId(copy.id);
  };

  const deleteSelected = () => {
    if (!selectedResume) return;
    const list = resumesList.filter((r) => r.id !== selectedResume.id);
    persist(list);
    if (!list.length) {
      setSelectedId(null);
    } else if (selectedResume.id === selectedId) {
      setSelectedId(list[0].id);
    }
  };

  // Update selected resume fields
  const updateResumeField = (field: keyof Resume, value: any) => {
    if (!selectedResume) return;
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id ? { ...r, [field]: value, lastModified: new Date() } : r
    );
    persist(updated);
  };

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    if (!selectedResume) return;
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? { ...r, personalInfo: { ...r.personalInfo, [field]: value }, lastModified: new Date() }
        : r
    );
    persist(updated);
  };

  const updateSkills = (skillsText: string) => {
    if (!selectedResume) return;
    setSkillsInput(skillsText); // Update local state immediately for responsive typing
    const skillsArray = skillsText.split(',').map((s) => s.trim()).filter(Boolean);
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? { ...r, skills: skillsArray, lastModified: new Date() }
        : r
    );
    persist(updated);
  };

  // Experience CRUD
  const addExperience = () => {
    if (!selectedResume) return;
    const newExp: Experience = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
    };
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? { ...r, experience: [...r.experience, newExp], lastModified: new Date() }
        : r
    );
    persist(updated);
  };

  const updateExperience = (expId: string, field: keyof Experience, value: any) => {
    if (!selectedResume) return;
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? {
            ...r,
            experience: r.experience.map((exp) =>
              exp.id === expId ? { ...exp, [field]: value } : exp
            ),
            lastModified: new Date(),
          }
        : r
    );
    persist(updated);
  };

  const deleteExperience = (expId: string) => {
    if (!selectedResume) return;
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? {
            ...r,
            experience: r.experience.filter((exp) => exp.id !== expId),
            lastModified: new Date(),
          }
        : r
    );
    persist(updated);
  };

  const addAchievement = (expId: string, achievement: string) => {
    if (!selectedResume) return;
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? {
            ...r,
            experience: r.experience.map((exp) =>
              exp.id === expId ? { ...exp, achievements: [...exp.achievements, achievement] } : exp
            ),
            lastModified: new Date(),
          }
        : r
    );
    persist(updated);
  };

  const deleteAchievement = (expId: string, index: number) => {
    if (!selectedResume) return;
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? {
            ...r,
            experience: r.experience.map((exp) =>
              exp.id === expId
                ? { ...exp, achievements: exp.achievements.filter((_, i) => i !== index) }
                : exp
            ),
            lastModified: new Date(),
          }
        : r
    );
    persist(updated);
  };

  // Education CRUD
  const addEducation = () => {
    if (!selectedResume) return;
    const newEdu: Education = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? { ...r, education: [...r.education, newEdu], lastModified: new Date() }
        : r
    );
    persist(updated);
  };

  const updateEducation = (eduId: string, field: keyof Education, value: any) => {
    if (!selectedResume) return;
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? {
            ...r,
            education: r.education.map((edu) =>
              edu.id === eduId ? { ...edu, [field]: value } : edu
            ),
            lastModified: new Date(),
          }
        : r
    );
    persist(updated);
  };

  const deleteEducation = (eduId: string) => {
    if (!selectedResume) return;
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? {
            ...r,
            education: r.education.filter((edu) => edu.id !== eduId),
            lastModified: new Date(),
          }
        : r
    );
    persist(updated);
  };

  // Projects CRUD
  const addProject = () => {
    if (!selectedResume) return;
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      technologies: [],
      link: '',
      startDate: '',
      endDate: '',
      current: false,
      highlights: [],
    };
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? { ...r, projects: [...r.projects, newProject], lastModified: new Date() }
        : r
    );
    persist(updated);
  };

  const updateProject = (projectId: string, field: keyof Project, value: any) => {
    if (!selectedResume) return;
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? {
            ...r,
            projects: r.projects.map((proj) =>
              proj.id === projectId ? { ...proj, [field]: value } : proj
            ),
            lastModified: new Date(),
          }
        : r
    );
    persist(updated);
  };

  const deleteProject = (projectId: string) => {
    if (!selectedResume) return;
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? {
            ...r,
            projects: r.projects.filter((proj) => proj.id !== projectId),
            lastModified: new Date(),
          }
        : r
    );
    persist(updated);
  };

  const addProjectHighlight = (projectId: string, highlight: string) => {
    if (!selectedResume) return;
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? {
            ...r,
            projects: r.projects.map((proj) =>
              proj.id === projectId
                ? { ...proj, highlights: [...proj.highlights, highlight] }
                : proj
            ),
            lastModified: new Date(),
          }
        : r
    );
    persist(updated);
  };

  const deleteProjectHighlight = (projectId: string, index: number) => {
    if (!selectedResume) return;
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? {
            ...r,
            projects: r.projects.map((proj) =>
              proj.id === projectId
                ? {
                    ...proj,
                    highlights: proj.highlights.filter((_, i) => i !== index),
                  }
                : proj
            ),
            lastModified: new Date(),
          }
        : r
    );
    persist(updated);
  };

  // Certifications CRUD
  const addCertification = () => {
    if (!selectedResume) return;
    const newCert: Certification = {
      id: crypto.randomUUID(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
      link: '',
    };
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? { ...r, certifications: [...r.certifications, newCert], lastModified: new Date() }
        : r
    );
    persist(updated);
  };

  const updateCertification = (certId: string, field: keyof Certification, value: any) => {
    if (!selectedResume) return;
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? {
            ...r,
            certifications: r.certifications.map((cert) =>
              cert.id === certId ? { ...cert, [field]: value } : cert
            ),
            lastModified: new Date(),
          }
        : r
    );
    persist(updated);
  };

  const deleteCertification = (certId: string) => {
    if (!selectedResume) return;
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? {
            ...r,
            certifications: r.certifications.filter((cert) => cert.id !== certId),
            lastModified: new Date(),
          }
        : r
    );
    persist(updated);
  };

  // Languages CRUD
  const addLanguage = () => {
    if (!selectedResume) return;
    const newLang: Language = {
      id: crypto.randomUUID(),
      name: '',
      proficiency: 'Professional',
    };
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? { ...r, languages: [...r.languages, newLang], lastModified: new Date() }
        : r
    );
    persist(updated);
  };

  const updateLanguage = (langId: string, field: keyof Language, value: any) => {
    if (!selectedResume) return;
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? {
            ...r,
            languages: r.languages.map((lang) =>
              lang.id === langId ? { ...lang, [field]: value } : lang
            ),
            lastModified: new Date(),
          }
        : r
    );
    persist(updated);
  };

  const deleteLanguage = (langId: string) => {
    if (!selectedResume) return;
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? {
            ...r,
            languages: r.languages.filter((lang) => lang.id !== langId),
            lastModified: new Date(),
          }
        : r
    );
    persist(updated);
  };

  // Portfolio Links CRUD
  const addLink = () => {
    if (!selectedResume) return;
    const newLink: PortfolioLink = {
      id: crypto.randomUUID(),
      type: 'GitHub',
      url: '',
      label: '',
    };
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? { ...r, links: [...r.links, newLink], lastModified: new Date() }
        : r
    );
    persist(updated);
  };

  const updateLink = (linkId: string, field: keyof PortfolioLink, value: any) => {
    if (!selectedResume) return;
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? {
            ...r,
            links: r.links.map((link) =>
              link.id === linkId ? { ...link, [field]: value } : link
            ),
            lastModified: new Date(),
          }
        : r
    );
    persist(updated);
  };

  const deleteLink = (linkId: string) => {
    if (!selectedResume) return;
    const updated = resumesList.map((r) =>
      r.id === selectedResume.id
        ? {
            ...r,
            links: r.links.filter((link) => link.id !== linkId),
            lastModified: new Date(),
          }
        : r
    );
    persist(updated);
  };

  // Use dynamic AI suggestions hook
  const { suggestions: aiSuggestions, isLoading: aiLoading, isAIPowered, provider: aiProvider, cached: aiCached, analyze: analyzeResumeAI } = useAISuggestions(
    selectedResume ? {
      id: selectedResume.id,
      personalInfo: selectedResume.personalInfo,
      summary: selectedResume.summary,
      skills: selectedResume.skills,
      experience: selectedResume.experience.map(exp => ({
        id: exp.id,
        company: exp.company,
        position: exp.position,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description,
        achievements: exp.achievements,
        current: exp.current,
      })),
      education: selectedResume.education.map(edu => ({
        id: edu.id,
        school: edu.institution,
        degree: edu.degree,
        field: edu.field,
        startDate: edu.startDate,
        endDate: edu.endDate,
        gpa: edu.gpa,
      })),
      projects: selectedResume.projects?.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        technologies: p.technologies,
        url: p.link,
        startDate: p.startDate,
        endDate: p.endDate,
        highlights: p.highlights,
      })),
      certifications: selectedResume.certifications?.map(c => ({
        id: c.id,
        name: c.name,
        issuer: c.issuer,
        date: c.date,
        credentialId: c.credentialId,
        verificationUrl: c.link,
      })),
      languages: selectedResume.languages?.map(l => ({
        id: l.id,
        language: l.name,
        proficiency: (l.proficiency === 'Professional' ? 'Fluent' : l.proficiency) as ('Native' | 'Fluent' | 'Intermediate' | 'Basic'),
      })),
      links: selectedResume.links?.map(l => ({
        id: l.id,
        platform: l.type,
        url: l.url,
      })),
    } : null
  , { auto: false });

  // Control auto-apply of AI suggestions
  const [autoApplyAISuggestions, setAutoApplyAISuggestions] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = window.localStorage.getItem('resume:autoApplyAISuggestions');
    return saved ? saved === 'true' : false;
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('resume:autoApplyAISuggestions', String(autoApplyAISuggestions));
    }
  }, [autoApplyAISuggestions]);

  // Validation state
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    phone?: string;
    projectLink?: { [key: string]: string };
    certificationLink?: { [key: string]: string };
    portfolioUrl?: { [key: string]: string };
  }>({});

  // Hide suggestions after applying
  const [dismissedSuggestionIndexes, setDismissedSuggestionIndexes] = useState<number[]>([]);
  useEffect(() => {
    // Reset dismissals when new suggestions arrive
    setDismissedSuggestionIndexes([]);
  }, [aiSuggestions]);
  const visibleSuggestions = useMemo(() =>
    aiSuggestions.filter((_, idx) => !dismissedSuggestionIndexes.includes(idx))
  , [aiSuggestions, dismissedSuggestionIndexes]);

  // Auto-apply AI suggestions from Gemini when available
  const appliedSuggestionKeysRef = useRef<Set<string>>(new Set());
  const lastAISuggestionsRef = useRef<typeof aiSuggestions>([]);
  useEffect(() => {
    if (!selectedResume) return;
    if (aiLoading || !isAIPowered) return; // only auto-apply real AI output
    if (!autoApplyAISuggestions) return; // respect user toggle
    if (aiSuggestions === lastAISuggestionsRef.current) return; // prevent re-runs on unrelated changes
    lastAISuggestionsRef.current = aiSuggestions;

    aiSuggestions.forEach((s, idx) => {
      const key = `${s.type}:${s.title}:${(s.description || '').slice(0, 64)}`;
      if (appliedSuggestionKeysRef.current.has(key)) return;

      let applied = false;

      // 1) Keyword suggestions -> add missing keywords to skills
      if (s.type === 'keyword' && s.keywords && s.keywords.length > 0) {
        const currentLower = new Set(selectedResume.skills.map(sk => sk.toLowerCase()));
        const toAdd = s.keywords.filter(k => !currentLower.has(k.toLowerCase()));
        if (toAdd.length > 0) {
          const unique = Array.from(new Set([...selectedResume.skills, ...toAdd]));
          updateResumeField('skills', unique);
          applied = true;
        }
      }

      // 2) Achievements quantification suggestions -> add a quantified example to first role
      const text = `${s.title} ${s.description || ''}`.toLowerCase();
      if (!applied && (s.type === 'improvement' || s.type === 'content')) {
        if (/achieve|quantif|metric|percentage|impact/.test(text)) {
          if (selectedResume.experience.length > 0) {
            const expId = selectedResume.experience[0].id;
            addAchievement(expId, 'Delivered measurable impact (e.g., improved X by 20%).');
            applied = true;
          }
        }
      }

      // 3) Summary improvements -> append a strong, concise line
      if (!applied && (s.type === 'improvement' || s.type === 'content') && /summary/.test(text)) {
        const nextSummary = `${selectedResume.summary || ''}\nFocused engineer highlighting outcomes, ownership, and metrics.`.trim();
        updateResumeField('summary', nextSummary);
        applied = true;
      }

      // 4) Formatting suggestions are not auto-applied (require user intent)

      if (applied) {
        appliedSuggestionKeysRef.current.add(key);
        setDismissedSuggestionIndexes(prev => (prev.includes(idx) ? prev : [...prev, idx]));
      }
    });
  }, [aiSuggestions, aiLoading, isAIPowered, autoApplyAISuggestions]);

  const computeATSScore = (r: Resume) => {
    if (!r) return 0;
    let score = 50; // baseline

    // Contact completeness
    const contactFields = [r.personalInfo.fullName, r.personalInfo.email, r.personalInfo.phone, r.personalInfo.title];
    const contactComplete = contactFields.filter(Boolean).length;
    score += Math.min(10, contactComplete * 3);

    // Summary length
    if ((r.summary || '').trim().length > 60) score += 8;

    // Skills count
    score += Math.min(15, (r.skills?.length || 0) * 2);

    // Quantified achievements detection
    const quantified = r.experience.reduce((acc, exp) => {
      const q = exp.achievements.filter(a => /\d+%|\d+\s?(people|users|customers|sales)|\b\d+\b/.test(a)).length;
      return acc + q;
    }, 0);
    score += Math.min(15, quantified * 5);

    // Keyword matching
    const text = [r.summary, ...r.experience.map(e => e.description + ' ' + e.achievements.join(' ')), r.skills.join(' ')].join(' ').toLowerCase();
    let keywordMatches = 0;
    KEYWORDS.forEach(k => { if (text.includes(k)) keywordMatches++; });
    score += Math.min(10, keywordMatches * 2);

    // NEW: Projects bonus
    if (r.projects && r.projects.length > 0) score += 5;

    // NEW: Certifications bonus
    if (r.certifications && r.certifications.length > 0) score += 10;

    // NEW: Languages bonus
    if (r.languages && r.languages.length > 0) score += Math.min(5, r.languages.length * 2);

    // NEW: Portfolio/GitHub links bonus
    if (r.links && r.links.length > 0) {
      const hasGithub = r.links.some(link => link.type === 'GitHub');
      const hasLinkedIn = r.links.some(link => link.type === 'LinkedIn');
      if (hasGithub) score += 5;
      if (hasLinkedIn) score += 3;
    }

    // Clamp
    score = Math.max(10, Math.min(95, Math.round(score)));
    return score;
  };

  const analyzeResume = (r: Resume | null) => {
    if (!r) return;
    const score = computeATSScore(r);
    // update resume score in list
    const updated = resumesList.map(rr => rr.id === r.id ? { ...rr, atsScore: score, lastModified: new Date() } : rr);
    persist(updated);
    // AI suggestions are now handled by useAISuggestions hook
  };

  const handleApplySuggestion = (index: number) => {
    if (!selectedResume) return;
    const suggestion = aiSuggestions[index];
    if (!suggestion) return;

    if (suggestion.type === 'keyword' && suggestion.keywords) {
      // Open modal to select keywords
      setSelectedKeywords(suggestion.keywords);
      setIsKeywordModalOpen(true);
    } else if (suggestion.type === 'improvement' && suggestion.title.includes('achievements')) {
      // Open modal to add achievement
      setNewAchievement('');
      setIsAchievementModalOpen(true);
    } else if (suggestion.type === 'improvement' && suggestion.title.includes('summary')) {
      // Open modal to improve summary
      setSummaryInput(selectedResume.summary || '');
      setIsSummaryModalOpen(true);
    } else if (suggestion.type === 'format') {
      // Auto-apply format suggestions
      // Dismiss immediately
      setDismissedSuggestionIndexes((prev) => prev.includes(index) ? prev : [...prev, index]);
      return;
    }

    // Don't dismiss yet - wait for modal input
    // Dismiss will happen after user confirms in modal

    // re-analyze after applying
    setTimeout(() => {
      const r = resumesList.find(rr => rr.id === selectedId) || null;
      analyzeResume(r);
    }, 150);
  };

  // Modal handlers for AI suggestions
  const handleAddKeywords = () => {
    if (!selectedResume || selectedKeywords.length === 0) return;
    const newSkills = Array.from(new Set([...selectedResume.skills, ...selectedKeywords]));
    updateResumeField('skills', newSkills);
    setIsKeywordModalOpen(false);
    setSelectedKeywords([]);
    
    // Re-analyze
    setTimeout(() => {
      const r = resumesList.find(rr => rr.id === selectedId) || null;
      analyzeResume(r);
    }, 150);
  };

  const handleAddAchievement = () => {
    if (!selectedResume || !newAchievement.trim()) return;
    if (selectedResume.experience.length > 0) {
      const expId = selectedResume.experience[0].id;
      addAchievement(expId, newAchievement.trim());
    }
    setIsAchievementModalOpen(false);
    setNewAchievement('');
    
    // Re-analyze
    setTimeout(() => {
      const r = resumesList.find(rr => rr.id === selectedId) || null;
      analyzeResume(r);
    }, 150);
  };

  const handleUpdateSummary = () => {
    if (!selectedResume || !summaryInput.trim()) return;
    updateResumeField('summary', summaryInput.trim());
    setIsSummaryModalOpen(false);
    setSummaryInput('');
    
    // Re-analyze
    setTimeout(() => {
      const r = resumesList.find(rr => rr.id === selectedId) || null;
      analyzeResume(r);
    }, 150);
  };

  const toggleKeywordSelection = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  // Memoize ATS score to avoid expensive recalculation
  const currentATSScore = useMemo(() => {
    if (!selectedResume) return 0;
    return computeATSScore(selectedResume);
  }, [
    selectedResume?.personalInfo.fullName,
    selectedResume?.personalInfo.email,
    selectedResume?.personalInfo.phone,
    selectedResume?.personalInfo.title,
    selectedResume?.summary,
    selectedResume?.experience,
    selectedResume?.education,
    selectedResume?.skills,
    selectedResume?.projects,
    selectedResume?.certifications,
    selectedResume?.languages,
    selectedResume?.links
  ]);

  // Analyze resume when selected or on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!mounted || !selectedResume) return;
    // Prevent re-analysis if we've already analyzed this resume
    if (lastAnalyzedId.current === selectedResume.id) return;
    lastAnalyzedId.current = selectedResume.id;
    
    const updated = resumesList.map(rr => rr.id === selectedResume.id ? { ...rr, atsScore: currentATSScore, lastModified: new Date() } : rr);
    persist(updated);
  }, [mounted, selectedResume?.id, currentATSScore]);


  const handleDownloadPDF = async () => {
    if (!selectedResume) return;

    try {
      // Dynamically import heavy libraries only when needed
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');

      // Get the resume preview element
      const element = document.getElementById('resume-preview-modal') || document.getElementById('resume-preview');
      if (!element) {
        console.error('Resume preview element not found');
        return;
      }

      // Inject a compact print stylesheet and class to precisely control spacing
      const originalStyle = element.style.cssText;
      const styleTag = document.createElement('style');
      styleTag.id = 'pdf-compact-style';
      styleTag.textContent = `
        #resume-preview.pdf-compact, #resume-preview-modal.pdf-compact {
          padding: 12mm !important;
          font-size: 10.5pt !important;
          line-height: 1.25 !important;
          max-width: 210mm !important;
          box-sizing: border-box !important;
          background: #ffffff !important;
          color: #111827 !important;
        }
        #resume-preview.pdf-compact h1, #resume-preview-modal.pdf-compact h1 { font-size: 18pt !important; margin: 0 0 4pt !important; }
        #resume-preview.pdf-compact h2, #resume-preview-modal.pdf-compact h2 { font-size: 12pt !important; margin: 6pt 0 4pt !important; }
        #resume-preview.pdf-compact h3, #resume-preview-modal.pdf-compact h3 { font-size: 10.5pt !important; margin: 4pt 0 3pt !important; }
        #resume-preview.pdf-compact p, #resume-preview-modal.pdf-compact p,
        #resume-preview.pdf-compact li, #resume-preview-modal.pdf-compact li { font-size: 10pt !important; line-height: 1.25 !important; margin: 0 0 2pt !important; }
        #resume-preview.pdf-compact ul, #resume-preview-modal.pdf-compact ul { margin: 0 0 4pt !important; padding-left: 12pt !important; }
        #resume-preview.pdf-compact .pl-6, #resume-preview-modal.pdf-compact .pl-6 { padding-left: 8pt !important; }
        #resume-preview.pdf-compact [class*="mb-"], #resume-preview-modal.pdf-compact [class*="mb-"] { margin-bottom: 6pt !important; }
        #resume-preview.pdf-compact [class*="space-y-"] > * + *,
        #resume-preview-modal.pdf-compact [class*="space-y-"] > * + * { margin-top: 6pt !important; }
        #resume-preview.pdf-compact [class*="gap-"], #resume-preview-modal.pdf-compact [class*="gap-"] { gap: 4pt !important; }
        #resume-preview.pdf-compact .border-b-2, #resume-preview-modal.pdf-compact .border-b-2 { border-bottom-width: 1px !important; }
      `;
      document.head.appendChild(styleTag);
      element.classList.add('pdf-compact');

      // Wait for layout to settle
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture with optimized settings for single-page fit
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: Math.max(794, element.scrollWidth),
        windowHeight: element.scrollHeight,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      // Restore original styles
      element.style.cssText = originalStyle;
      element.classList.remove('pdf-compact');
      if (styleTag.parentNode) styleTag.parentNode.removeChild(styleTag);

      // A4 dimensions
      const pageWidth = 210;
      const pageHeight = 297;
      
      // Calculate image dimensions to fit A4
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      
      // If content is too tall, scale it down to fit one page
      const scale = imgHeight > pageHeight ? pageHeight / imgHeight : 1;
      const finalWidth = imgWidth * scale;
      const finalHeight = imgHeight * scale;
      
      // Center on page if smaller
      const xOffset = (pageWidth - finalWidth) / 2;
      const yOffset = (pageHeight - finalHeight) / 2;

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Add image to fit exactly on one page
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);

      // Generate filename
      const safeName = sanitizeFilename(selectedResume.personalInfo.fullName) || 'Resume';
      const fileName = `${safeName}_Resume.pdf`;
      
      // Download the PDF
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleExportJSON = useCallback(() => {
    if (!selectedResume) return;
    
    try {
      const dataStr = JSON.stringify(selectedResume, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const safeName = sanitizeFilename(selectedResume.personalInfo.fullName) || 'Resume';
      const fileName = `${safeName}_Resume.json`;
      saveAs(dataBlob, fileName);
    } catch (error) {
      console.error('Error exporting JSON:', error);
      alert('Failed to export JSON. Please try again.');
    }
  }, [selectedResume]);

  const handleExportPlainText = useCallback(() => {
    if (!selectedResume) return;
    
    try {
      const r = selectedResume;
      let text = '';
      
      // Header
      text += `${r.personalInfo.fullName}\n`;
      if (r.personalInfo.title) text += `${r.personalInfo.title}\n`;
      text += `\n`;
      
      // Contact
      if (r.personalInfo.email) text += `Email: ${r.personalInfo.email}\n`;
      if (r.personalInfo.phone) text += `Phone: ${r.personalInfo.phone}\n`;
      if (r.personalInfo.location) text += `Location: ${r.personalInfo.location}\n`;
      text += `\n`;
      
      // Links
      if (r.links && r.links.length > 0) {
        text += `LINKS\n${'='.repeat(50)}\n`;
        r.links.forEach(link => {
          text += `${link.type}: ${link.url}\n`;
        });
        text += `\n`;
      }
      
      // Summary
      if (r.summary) {
        text += `PROFESSIONAL SUMMARY\n${'='.repeat(50)}\n${r.summary}\n\n`;
      }
      
      // Skills
      if (r.skills.length > 0) {
        text += `SKILLS\n${'='.repeat(50)}\n${r.skills.join(' • ')}\n\n`;
      }
      
      // Experience
      if (r.experience.length > 0) {
        text += `EXPERIENCE\n${'='.repeat(50)}\n`;
        r.experience.forEach(exp => {
          text += `\n${exp.position} at ${exp.company}\n`;
          const startDate = formatDateSafe(exp.startDate, 'short');
          const endDate = exp.current ? 'Present' : formatDateSafe(exp.endDate, 'short');
          text += `${startDate} - ${endDate}\n`;
          if (exp.description) text += `${exp.description}\n`;
          if (exp.achievements.length > 0) {
            exp.achievements.forEach(ach => {
              text += `  • ${ach}\n`;
            });
          }
        });
        text += `\n`;
      }
      
      // Projects
      if (r.projects && r.projects.length > 0) {
        text += `PROJECTS\n${'='.repeat(50)}\n`;
        r.projects.forEach(proj => {
          text += `\n${proj.name}\n`;
          const startDate = formatDateSafe(proj.startDate, 'short');
          const endDate = proj.current ? 'Present' : formatDateSafe(proj.endDate, 'short');
          text += `${startDate} - ${endDate}\n`;
          text += `${proj.description}\n`;
          if (proj.technologies.length > 0) {
            text += `Technologies: ${proj.technologies.join(', ')}\n`;
          }
          if (proj.link) text += `Link: ${proj.link}\n`;
          if (proj.highlights.length > 0) {
            proj.highlights.forEach(h => {
              text += `  • ${h}\n`;
            });
          }
        });
        text += `\n`;
      }
      
      // Education
      if (r.education.length > 0) {
        text += `EDUCATION\n${'='.repeat(50)}\n`;
        r.education.forEach(edu => {
          text += `\n${edu.degree} in ${edu.field}\n`;
          text += `${edu.institution}\n`;
          const startDate = formatDateSafe(edu.startDate, 'short');
          const endDate = formatDateSafe(edu.endDate, 'short');
          text += `${startDate} - ${endDate}\n`;
          if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
        });
        text += `\n`;
      }
      
      // Certifications
      if (r.certifications && r.certifications.length > 0) {
        text += `CERTIFICATIONS\n${'='.repeat(50)}\n`;
        r.certifications.forEach(cert => {
          text += `\n${cert.name}\n`;
          text += `${cert.issuer}\n`;
          const date = formatDateSafe(cert.date, 'short');
          text += `Issued: ${date}\n`;
          if (cert.credentialId) text += `Credential ID: ${cert.credentialId}\n`;
          if (cert.link) text += `Verification: ${cert.link}\n`;
        });
        text += `\n`;
      }
      
      // Languages
      if (r.languages && r.languages.length > 0) {
        text += `LANGUAGES\n${'='.repeat(50)}\n`;
        r.languages.forEach(lang => {
          text += `${lang.name}: ${lang.proficiency}\n`;
        });
        text += `\n`;
      }
      
      const dataBlob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const safeName = sanitizeFilename(r.personalInfo.fullName) || 'Resume';
      const fileName = `${safeName}_Resume.txt`;
      saveAs(dataBlob, fileName);
    } catch (error) {
      console.error('Error exporting plain text:', error);
      alert('Failed to export plain text. Please try again.');
    }
  }, [selectedResume]);

  const handleExportDOCX = useCallback(async () => {
    if (!selectedResume) return;
    
    try {
      // Use centralized export utility
      const { exportToDocx } = await import('@/lib/resume-export');
      await exportToDocx(selectedResume);
    } catch (error) {
      console.error('Error exporting DOCX:', error);
      alert('Failed to export DOCX. Please try again.');
    }
  }, [selectedResume]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <FileText className="h-8 w-8 mr-3 text-blue-500" />
                Resume Builder
                {/* Save Status Indicator */}
                {saveStatus === 'saving' && (
                  <span className="ml-3 text-sm font-normal text-yellow-500 flex items-center">
                    <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                )}
                {saveStatus === 'saved' && (
                  <span className="ml-3 text-sm font-normal text-green-500 flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    Saved
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span className="ml-3 text-sm font-normal text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Error saving
                  </span>
                )}
              </h1>
              <p className="text-muted-foreground">
                {selectedResume 
                  ? `Editing "${selectedResume.name}" • ${resumesList.length} resume${resumesList.length !== 1 ? 's' : ''} total`
                  : `${resumesList.length} resume${resumesList.length !== 1 ? 's' : ''} • Create your first ATS-optimized resume`
                }
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setIsImportModalOpen(true)}
                className="hidden sm:flex"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Dialog open={isNewResumeOpen} onOpenChange={setIsNewResumeOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">New Resume</span>
                    <span className="sm:hidden">New</span>
                  </Button>
                </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Resume</DialogTitle>
                  <DialogDescription>
                    Choose a template to get started with your new resume.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 py-4">
                  {templates.map((template) => {
                    const bgColor = 
                      template.id === 'modern' ? 'bg-blue-500/20' :
                      template.id === 'classic' ? 'bg-gray-500/20' :
                      'bg-purple-500/20';
                    const iconColor = 
                      template.id === 'modern' ? 'text-blue-500' :
                      template.id === 'classic' ? 'text-gray-500' :
                      'text-purple-500';
                    
                    return (
                      <motion.div
                        key={template.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          createResume(template.id as Resume['template']);
                          setIsNewResumeOpen(false);
                        }}
                        className="flex items-center space-x-3 p-3 rounded-lg border border-white/20 hover:bg-white/5 cursor-pointer transition-all"
                      >
                        <div className={`w-12 h-16 rounded ${bgColor} flex items-center justify-center`}>
                          <FileText className={`h-6 w-6 ${iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium capitalize">{template.name}</h4>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Resume List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <GlassCard className="p-4" gradient>
              <h3 className="font-semibold mb-4">Your Resumes</h3>
              <div className="space-y-3">
                {/* Only render list after mount to avoid any subtle icon structural differences */}
                {mounted && resumesList.map((resume) => (
                  <motion.div
                    key={resume.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (editingNameId !== resume.id) {
                        setSelectedId(resume.id);
                      }
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedResume?.id === resume.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      {editingNameId === resume.id ? (
                        <Input
                          autoFocus
                          value={resume.name}
                          onChange={(e) => {
                            const updated = resumesList.map(r => 
                              r.id === resume.id ? { ...r, name: e.target.value, lastModified: new Date() } : r
                            );
                            persist(updated);
                          }}
                          onBlur={() => setEditingNameId(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') setEditingNameId(null);
                            if (e.key === 'Escape') setEditingNameId(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="h-7 text-sm font-medium px-2"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 flex-1">
                          <h4 className="font-medium text-sm">{resume.name}</h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingNameId(resume.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 hover:text-blue-500 transition-opacity"
                          >
                            <Edit3 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      {resume.isDefault && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="capitalize">{resume.template}</span>
                      <span className={getScoreColor(resume.atsScore)}>
                        {resume.atsScore}%
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <Progress value={resume.atsScore} className="h-1 flex-1" />
                      <span className="text-[10px] text-muted-foreground ml-2">
                        {new Date(resume.lastModified).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-white/10">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="optimize">Optimize</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                {!selectedResume && (
                  <GlassCard className="p-12 text-center" gradient>
                    <FileText className="h-16 w-16 mx-auto mb-4 text-blue-500 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No Resume Selected</h3>
                    <p className="text-muted-foreground mb-6">
                      Create a new resume or select an existing one from the sidebar
                    </p>
                    <Button 
                      onClick={() => setIsNewResumeOpen(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Resume
                    </Button>
                  </GlassCard>
                )}

                {/* Resume Name Editor */}
                {selectedResume && (
                  <GlassCard className="p-4 mb-6" gradient>
                    <div className="flex items-center space-x-3">
                      <Edit3 className="h-5 w-5 text-blue-500" />
                      <Input
                        value={selectedResume.name}
                        onChange={(e) => updateResumeField('name', e.target.value)}
                        className="text-lg font-semibold bg-transparent border-none focus:ring-2 focus:ring-blue-500 px-2"
                        placeholder="Resume Name"
                      />
                    </div>
                  </GlassCard>
                )}

                {/* Template Selector */}
                {selectedResume && (
                  <GlassCard className="p-6 mb-6" gradient>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Template Style</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsTemplatePreviewOpen(true)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview & Change
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {templates.map((template) => {
                        const isSelected = selectedResume.template === template.id;
                        const borderColor = 
                          template.id === 'modern' ? (isSelected ? 'border-blue-500 bg-blue-500/10' : '') :
                          template.id === 'classic' ? (isSelected ? 'border-gray-500 bg-gray-500/10' : '') :
                          template.id === 'creative' ? (isSelected ? 'border-purple-500 bg-purple-500/10' : '') :
                          '';
                        
                        return (
                          <button
                            key={template.id}
                            onClick={() => updateResumeField('template', template.id)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              isSelected
                                ? borderColor
                                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 hover:bg-white/5'
                            }`}
                          >
                            <div className="text-2xl mb-2">
                              {template.id === 'modern' ? '📱' :
                               template.id === 'classic' ? '📄' :
                               '🎨'}
                            </div>
                            <p className="font-medium text-sm capitalize">{template.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {template.description}
                            </p>
                            {isSelected && (
                              <div className="mt-2 flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-xs text-green-500 ml-1">Active</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </GlassCard>
                )}
                
                {selectedResume && (
                  <>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* ATS Score */}
                  <GlassCard className="p-6" gradient>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">ATS Compatibility</h3>
                      <Zap className="h-5 w-5 text-yellow-500" />
                    </div>
                    <ATSScoreBadge 
                      score={selectedResume?.atsScore || 0} 
                      showDetails={true}
                      className="w-full"
                    />
                  </GlassCard>

                  {/* Quick Actions */}
                  <GlassCard className="p-6" gradient>
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveTab('preview')}
                        disabled={!selectedResume}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Resume
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setIsVersionHistoryOpen(true)}
                        disabled={!selectedResume}
                      >
                        <History className="h-4 w-4 mr-2" />
                        Version History ({selectedResume?.versions?.length || 0})
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setIsThemeCustomizerOpen(true)}
                        disabled={!selectedResume}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Customize Theme
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            disabled={!selectedResume}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export Resume
                            <ChevronDown className="h-4 w-4 ml-auto" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                          <DropdownMenuItem onClick={handleDownloadPDF}>
                            <FileText className="h-4 w-4 mr-2" />
                            PDF Document
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleExportDOCX}>
                            <FileText className="h-4 w-4 mr-2" />
                            Word Document (.docx)
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleExportPlainText}>
                            <FileText className="h-4 w-4 mr-2" />
                            Plain Text (.txt)
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleExportJSON}>
                            <Code className="h-4 w-4 mr-2" />
                            JSON Data (.json)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button variant="outline" className="w-full justify-start" onClick={duplicateSelected} disabled={!selectedResume}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate Resume
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600" onClick={deleteSelected} disabled={!selectedResume}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Resume
                      </Button>
                    </div>
                  </GlassCard>
                </div>

                {/* Resume Statistics */}
                <GlassCard className="p-6 mt-6" gradient>
                  <h3 className="text-lg font-semibold mb-4">Resume Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded-lg bg-white/5">
                      <Briefcase className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                      <div className="text-2xl font-bold">{selectedResume?.experience.length || 0}</div>
                      <div className="text-xs text-muted-foreground">Experience{selectedResume?.experience.length !== 1 ? 's' : ''}</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-white/5">
                      <GraduationCap className="h-5 w-5 mx-auto mb-2 text-purple-500" />
                      <div className="text-2xl font-bold">{selectedResume?.education.length || 0}</div>
                      <div className="text-xs text-muted-foreground">Education</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-white/5">
                      <Award className="h-5 w-5 mx-auto mb-2 text-green-500" />
                      <div className="text-2xl font-bold">{selectedResume?.skills.length || 0}</div>
                      <div className="text-xs text-muted-foreground">Skill{selectedResume?.skills.length !== 1 ? 's' : ''}</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-white/5">
                      <Zap className="h-5 w-5 mx-auto mb-2 text-yellow-500" />
                      <div className="text-2xl font-bold">
                        {selectedResume?.experience.reduce((sum, exp) => sum + exp.achievements.length, 0) || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Achievement{selectedResume?.experience.reduce((sum, exp) => sum + exp.achievements.length, 0) !== 1 ? 's' : ''}</div>
                    </div>
                  </div>
                </GlassCard>

                {/* AI Suggestions */}
                <AISuggestionsPanel
                  suggestions={visibleSuggestions}
                  isLoading={aiLoading}
                  isAIPowered={isAIPowered}
                  onApplySuggestion={handleApplySuggestion}
                  onAnalyze={analyzeResumeAI}
                  provider={aiProvider}
                  cached={aiCached}
                />
                  </>
                )}
              </TabsContent>

              <TabsContent value="editor" className="mt-6">
                <GlassCard className="p-6" gradient>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Form Fields */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <User className="h-5 w-5 mr-2" />
                          Personal Information
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <Label htmlFor="pi-fullName">Full Name</Label>
                            <Input
                              id="pi-fullName"
                              placeholder="Full Name"
                              autoComplete="name"
                              value={selectedResume?.personalInfo.fullName || ''}
                              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="pi-title">Job Title</Label>
                            <Input
                              id="pi-title"
                              placeholder="Job Title"
                              autoComplete="organization-title"
                              value={selectedResume?.personalInfo.title || ''}
                              onChange={(e) => updatePersonalInfo('title', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="pi-email">Email Address</Label>
                            <Input
                              id="pi-email"
                              placeholder="Email Address"
                              type="email"
                              autoComplete="email"
                              value={selectedResume?.personalInfo.email || ''}
                              onChange={(e) => {
                                updatePersonalInfo('email', e.target.value);
                                const result = validateEmail(e.target.value);
                                setValidationErrors(prev => ({
                                  ...prev,
                                  email: result.error
                                }));
                              }}
                              className={validationErrors.email ? 'border-destructive' : ''}
                            />
                            <InputError message={validationErrors.email} />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="pi-phone">Phone Number</Label>
                            <Input
                              id="pi-phone"
                              placeholder="Phone Number"
                              type="tel"
                              autoComplete="tel"
                              value={selectedResume?.personalInfo.phone || ''}
                              onChange={(e) => {
                                updatePersonalInfo('phone', e.target.value);
                                const result = validatePhone(e.target.value);
                                setValidationErrors(prev => ({
                                  ...prev,
                                  phone: result.error
                                }));
                              }}
                              className={validationErrors.phone ? 'border-destructive' : ''}
                            />
                            <InputError message={validationErrors.phone} />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="pi-location">Location</Label>
                            <Input
                              id="pi-location"
                              placeholder="Location"
                              autoComplete="address-level2"
                              value={selectedResume?.personalInfo.location || ''}
                              onChange={(e) => updatePersonalInfo('location', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <Briefcase className="h-5 w-5 mr-2" />
                          Professional Summary
                        </h3>
                        <Textarea
                          placeholder="Write a compelling summary of your professional background..."
                          rows={4}
                          value={selectedResume?.summary || ''}
                          onChange={(e) => updateResumeField('summary', e.target.value)}
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <GraduationCap className="h-5 w-5 mr-2" />
                          Skills
                        </h3>
                        <SkillsTagInput
                          skills={selectedResume?.skills || []}
                          onChange={updateSkillsArray}
                        />
                      </div>

                      {/* Experience Section */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold flex items-center">
                            <Briefcase className="h-5 w-5 mr-2" />
                            Experience
                          </h3>
                          <Button size="sm" variant="outline" onClick={addExperience}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                        <ScrollArea className="h-96">
                          <div className="space-y-4 pr-4">
                            {selectedResume && selectedResume.experience.length === 0 && (
                              <div className="text-center py-12 text-muted-foreground">
                                <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p className="text-sm">No work experience added yet</p>
                                <p className="text-xs mt-1">Click &quot;Add&quot; to add your first role</p>
                              </div>
                            )}
                            {selectedResume?.experience.map((exp) => (
                              <div key={exp.id} className="p-4 rounded-lg border border-white/20 bg-white/5 space-y-3">
                                <div className="flex items-center justify-between">
                                  <Input
                                    placeholder="Company"
                                    value={exp.company}
                                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                    className="flex-1 mr-2"
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => deleteExperience(exp.id)}
                                    className="text-red-500"
                                    aria-label="Delete experience"
                                    title="Delete experience"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <Input
                                  placeholder="Position"
                                  value={exp.position}
                                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                  <DateInput
                                    label="Start Date"
                                    value={exp.startDate}
                                    onChange={(value) => updateExperience(exp.id, 'startDate', value)}
                                  />
                                  <DateInput
                                    label="End Date"
                                    value={exp.endDate}
                                    onChange={(value) => updateExperience(exp.id, 'endDate', value)}
                                    disabled={exp.current}
                                  />
                                </div>
                                <div className="flex items-center justify-between py-1">
                                  <Label htmlFor={`exp-current-${exp.id}`} className="text-sm">Current Role</Label>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-muted-foreground">{exp.current ? 'Active' : 'Past'}</span>
                                    <Switch
                                      id={`exp-current-${exp.id}`}
                                      checked={exp.current}
                                      onCheckedChange={(checked) => {
                                        const val = Boolean(checked);
                                        updateExperience(exp.id, 'current', val);
                                        if (val) updateExperience(exp.id, 'endDate', '');
                                      }}
                                      aria-label={exp.current ? 'Mark role as past' : 'Mark role as current'}
                                    />
                                  </div>
                                </div>
                                <Textarea
                                  placeholder="Brief description"
                                  value={exp.description}
                                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                  rows={2}
                                />
                                <AchievementList
                                  achievements={exp.achievements}
                                  onChange={(achievements) => updateExperience(exp.id, 'achievements', achievements)}
                                />
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>

                      {/* Education Section */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold flex items-center">
                            <GraduationCap className="h-5 w-5 mr-2" />
                            Education
                          </h3>
                          <Button size="sm" variant="outline" onClick={addEducation}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                        <div className="space-y-4">
                          {selectedResume && selectedResume.education.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                              <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-50" />
                              <p className="text-sm">No education added yet</p>
                              <p className="text-xs mt-1">Click &quot;Add&quot; to add your education history</p>
                            </div>
                          )}
                          {selectedResume?.education.map((edu) => (
                            <div key={edu.id} className="p-4 rounded-lg border border-white/20 bg-white/5 space-y-3">
                              <div className="flex items-center justify-between">
                                <Input
                                  placeholder="Institution"
                                  value={edu.institution}
                                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                  className="flex-1 mr-2"
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteEducation(edu.id)}
                                  className="text-red-500"
                                  aria-label="Delete education"
                                  title="Delete education"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  placeholder="Degree"
                                  value={edu.degree}
                                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                />
                                <Input
                                  placeholder="Field of Study"
                                  value={edu.field}
                                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                                />
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <DateInput
                                  label="Start"
                                  value={edu.startDate}
                                  onChange={(value) => updateEducation(edu.id, 'startDate', value)}
                                />
                                <DateInput
                                  label="End"
                                  value={edu.endDate}
                                  onChange={(value) => updateEducation(edu.id, 'endDate', value)}
                                />
                                <Input
                                  placeholder="GPA (optional)"
                                  value={edu.gpa || ''}
                                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Projects Section */}
                      <ProjectsEditor
                        projects={selectedResume?.projects || []}
                        onChange={(projects) => updateResumeField('projects', projects)}
                      />

                      {/* Certifications Section */}
                      <CertificationsEditor
                        certifications={selectedResume?.certifications || []}
                        onChange={(certifications) => updateResumeField('certifications', certifications)}
                      />

                      {/* Languages Section */}
                      <LanguagesEditor
                        languages={(selectedResume?.languages || []).map(l => ({ 
                          id: l.id, 
                          language: l.name, 
                          proficiency: l.proficiency === 'Professional' ? 'Fluent' : l.proficiency as any
                        }))}
                        onChange={(languages) => updateResumeField('languages', languages.map(l => ({ id: l.id, name: l.language, proficiency: l.proficiency as any })))}
                      />

                      {/* Portfolio Links Section */}
                      <LinksEditor
                        links={(selectedResume?.links || []).map(l => ({ id: l.id, platform: l.type, url: l.url }))}
                        onChange={(links) => updateResumeField('links', links.map(l => ({ id: l.id, type: l.platform as any, url: l.url, label: l.platform })))}
                      />

                      {/* Awards & Honors Section */}
                      {selectedResume && (
                        <AwardsEditor
                          awards={selectedResume.awards || []}
                          onChange={(awards) => updateResumeField('awards', awards)}
                        />
                      )}

                      {/* Volunteer Experience Section */}
                      {selectedResume && (
                        <VolunteerEditor
                          volunteer={selectedResume.volunteer || []}
                          onChange={(volunteer) => updateResumeField('volunteer', volunteer)}
                        />
                      )}
                    </div>

                    {/* Live Preview */}
                    <div className="rounded-lg shadow-lg overflow-hidden">
                      {selectedResume && (
                        <ResumeTemplate 
                          resume={selectedResume as ResumeData} 
                          template={selectedResume.template as TemplateType}
                          theme={themeCustomization}
                        />
                      )}
                    </div>
                  </div>
                </GlassCard>
              </TabsContent>

              <TabsContent value="preview" className="mt-6">
                <GlassCard className="p-6" gradient>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Resume Preview</h3>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setIsFullScreen(true)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Full Screen
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-500 to-purple-600"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export
                            <ChevronDown className="h-4 w-4 ml-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={handleDownloadPDF}>
                            <FileText className="h-4 w-4 mr-2" />
                            PDF Document
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleExportDOCX}>
                            <FileText className="h-4 w-4 mr-2" />
                            Word Document (.docx)
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleExportPlainText}>
                            <FileText className="h-4 w-4 mr-2" />
                            Plain Text (.txt)
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleExportJSON}>
                            <Code className="h-4 w-4 mr-2" />
                            JSON Data (.json)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <ScrollArea className="h-[800px]">
                    {selectedResume ? (
                      <ResumeTemplate 
                        resume={selectedResume as ResumeData} 
                        template={selectedResume.template as TemplateType}
                        theme={themeCustomization}
                      />
                    ) : (
                      <div className="text-center py-12 text-gray-400">
                        <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">No resume selected</p>
                        <p className="text-sm">Select a resume from the sidebar to preview</p>
                      </div>
                    )}
                  </ScrollArea>
                </GlassCard>
              </TabsContent>

              <TabsContent value="optimize" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <GlassCard className="p-6" gradient>
                    <div className="flex items-center space-x-2 mb-6">
                      <Settings className="h-5 w-5 text-blue-500" />
                      <h3 className="text-lg font-semibold">ATS Score Analysis</h3>
                    </div>
                    
                    {/* Big ATS Score Display */}
                    <div className="text-center mb-6 p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                      <div className={`text-6xl font-bold mb-2 ${getScoreColor(currentATSScore)}`}>
                        {currentATSScore}%
                      </div>
                      <p className="text-lg text-muted-foreground mb-3">
                        {getScoreLabel(currentATSScore)}
                      </p>
                      <Progress value={currentATSScore} className="h-3" />
                    </div>

                    {/* Score Breakdown */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <span className="text-sm">Contact Information</span>
                        <Badge variant="secondary" className={
                          (selectedResume?.personalInfo.email && selectedResume?.personalInfo.phone) 
                            ? "bg-green-500/20 text-green-500" 
                            : "bg-yellow-500/20 text-yellow-500"
                        }>
                          {(selectedResume?.personalInfo.email && selectedResume?.personalInfo.phone) ? 'Complete' : 'Needs Work'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <span className="text-sm">Keywords & Skills</span>
                        <Badge variant="secondary" className={
                          (selectedResume?.skills.length || 0) >= 5
                            ? "bg-green-500/20 text-green-500" 
                            : "bg-yellow-500/20 text-yellow-500"
                        }>
                          {(selectedResume?.skills.length || 0) >= 5 ? 'Good' : 'Add More'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <span className="text-sm">Quantified Achievements</span>
                        <Badge variant="secondary" className={
                          selectedResume?.experience.some(e => e.achievements.some(a => /\d+%|\d+\s?(people|users|customers)/.test(a)))
                            ? "bg-green-500/20 text-green-500"
                            : "bg-red-500/20 text-red-500"
                        }>
                          {selectedResume?.experience.some(e => e.achievements.some(a => /\d+%|\d+\s?(people|users|customers)/.test(a))) ? 'Excellent' : 'Missing'}
                        </Badge>
                      </div>
                    </div>
                  </GlassCard>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Auto-apply AI suggestions</div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={autoApplyAISuggestions}
                          onCheckedChange={(v) => setAutoApplyAISuggestions(Boolean(v))}
                          aria-label="Toggle auto-apply AI suggestions"
                        />
                      </div>
                    </div>
                    <AISuggestionsPanel
                      suggestions={visibleSuggestions}
                      isLoading={aiLoading}
                      isAIPowered={isAIPowered}
                      onApplySuggestion={handleApplySuggestion}
                      onAnalyze={analyzeResumeAI}
                      provider={aiProvider}
                      cached={aiCached}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      {/* Full Screen Preview Modal */}
      <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-4 pb-2 border-b">
            <DialogTitle>Resume Preview - {selectedResume?.name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 h-[calc(100%-5rem)] px-6 py-4">
            {selectedResume ? (
              <div id="resume-preview-modal">
                <ResumeTemplate 
                  resume={selectedResume as ResumeData} 
                  template={selectedResume.template as TemplateType}
                  theme={themeCustomization}
                />
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No resume selected</p>
                <p className="text-sm">Select a resume from the sidebar</p>
              </div>
            )}
          </ScrollArea>
          <div className="flex justify-end gap-2 px-6 pb-6 border-t pt-4">
            <Button variant="outline" onClick={() => setIsFullScreen(false)}>
              Close
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDownloadPDF}>
                  <FileText className="h-4 w-4 mr-2" />
                  PDF Document
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportDOCX}>
                  <FileText className="h-4 w-4 mr-2" />
                  Word Document (.docx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPlainText}>
                  <FileText className="h-4 w-4 mr-2" />
                  Plain Text (.txt)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportJSON}>
                  <Code className="h-4 w-4 mr-2" />
                  JSON Data (.json)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DialogContent>
      </Dialog>

      {/* Version History Modal */}
      <Dialog open={isVersionHistoryOpen} onOpenChange={setIsVersionHistoryOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Version History - {selectedResume?.name}
            </DialogTitle>
            <DialogDescription>
              View and restore previous versions of your resume. Up to 10 versions are kept.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {/* Current Version */}
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-500">Current</Badge>
                      <span className="text-sm font-medium">Working Version</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last modified: {selectedResume?.lastModified.toLocaleDateString()} at {selectedResume?.lastModified.toLocaleTimeString()}
                    </p>
                    <div className="mt-2 text-sm">
                      <p className="text-muted-foreground">
                        {selectedResume?.experience.length} experiences • {selectedResume?.education.length} education • {selectedResume?.skills.length} skills
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      if (selectedResume) {
                        const label = prompt('Enter version label:', 'Manual Save');
                        if (label) saveVersion(selectedResume, label);
                      }
                    }}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Save Version
                  </Button>
                </div>
              </div>

              {/* Saved Versions */}
              {selectedResume && selectedResume.versions && selectedResume.versions.length > 0 ? (
                [...selectedResume.versions].reverse().map((version, index) => (
                  <div 
                    key={version.id}
                    className="border-l-4 border-gray-300 pl-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{version.label}</span>
                          <Badge variant="outline" className="text-xs">
                            v{selectedResume.versions.length - index}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {version.timestamp.toLocaleDateString()} at {version.timestamp.toLocaleTimeString()}
                        </p>
                        <div className="mt-2 text-sm">
                          <p className="text-muted-foreground">
                            {version.data.experience.length} experiences • {version.data.education.length} education • {version.data.skills.length} skills
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedVersionId(version.id);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            if (confirm('Restore this version? Your current changes will be saved as a new version.')) {
                              if (selectedResume) saveVersion(selectedResume, 'Auto-save before restore');
                              restoreVersion(version.id);
                            }
                          }}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Restore
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No Saved Versions</p>
                  <p className="text-sm">Click &quot;Save Version&quot; to create a snapshot of your resume</p>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {selectedResume?.versions?.length || 0} of 10 versions saved
            </p>
            <Button variant="outline" onClick={() => setIsVersionHistoryOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New UX Enhancement Modals */}
      <OnboardingWizard
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleOnboardingComplete}
      />

      <TemplatePreviewModal
        isOpen={isTemplatePreviewOpen}
        onClose={() => setIsTemplatePreviewOpen(false)}
        currentTemplate={selectedResume?.template || 'modern'}
        onSelectTemplate={handleTemplateChange}
        resumeData={selectedResume ? {
          personalInfo: selectedResume.personalInfo,
          summary: selectedResume.summary,
          skills: selectedResume.skills,
          experience: selectedResume.experience,
          education: selectedResume.education.map(e => ({ ...e, gpa: e.gpa || '' })),
          projects: selectedResume.projects,
          certifications: selectedResume.certifications,
          languages: selectedResume.languages,
          links: selectedResume.links,
        } : {
          personalInfo: { fullName: '', email: '', phone: '', location: '', title: '' },
          summary: '',
          skills: [],
          experience: [],
          education: [],
          projects: [],
          certifications: [],
          languages: [],
          links: [],
        }}
      />

      <VersionHistoryImproved
        isOpen={isVersionHistoryOpen}
        onClose={() => setIsVersionHistoryOpen(false)}
        currentVersion={{
          experience: selectedResume?.experience || [],
          education: selectedResume?.education || [],
          skills: selectedResume?.skills || [],
          lastModified: selectedResume?.lastModified || new Date(),
        }}
        versions={selectedResume?.versions || []}
        onSave={(label) => selectedResume && saveVersion(selectedResume, label)}
        onRestore={restoreVersion}
        onPreview={(versionId) => setSelectedVersionId(versionId)}
      />

      <ThemeCustomizer
        isOpen={isThemeCustomizerOpen}
        onClose={() => setIsThemeCustomizerOpen(false)}
        theme={themeCustomization}
        onChange={handleThemeChange}
      />

      <ResumeImportModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onImport={handleImportResume}
      />

      {/* AI Suggestion Input Modals */}
      <Dialog open={isKeywordModalOpen} onOpenChange={setIsKeywordModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Recommended Keywords</DialogTitle>
            <DialogDescription>
              Select the keywords you'd like to add to your skills section.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {selectedKeywords.map((keyword) => (
              <div key={keyword} className="flex items-center space-x-2">
                <Checkbox
                  id={keyword}
                  checked={selectedKeywords.includes(keyword)}
                  onCheckedChange={() => toggleKeywordSelection(keyword)}
                />
                <label
                  htmlFor={keyword}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {keyword}
                </label>
              </div>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsKeywordModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddKeywords} disabled={selectedKeywords.length === 0}>
              Add {selectedKeywords.length} Keyword{selectedKeywords.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAchievementModalOpen} onOpenChange={setIsAchievementModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Quantified Achievement</DialogTitle>
            <DialogDescription>
              Describe your achievement with metrics (numbers, percentages, time frames).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="achievement">Achievement</Label>
            <Textarea
              id="achievement"
              value={newAchievement}
              onChange={(e) => setNewAchievement(e.target.value)}
              placeholder="e.g., Increased sales by 35% over 6 months by implementing new CRM system"
              className="mt-2 min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground mt-2">
              💡 Tip: Use the format "Action + Result + Method" with specific numbers
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsAchievementModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAchievement} disabled={!newAchievement.trim()}>
              Add to First Experience
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSummaryModalOpen} onOpenChange={setIsSummaryModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Improve Professional Summary</DialogTitle>
            <DialogDescription>
              Edit your professional summary to highlight your key strengths and experience.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea
              id="summary"
              value={summaryInput}
              onChange={(e) => setSummaryInput(e.target.value)}
              placeholder="Experienced professional with..."
              className="mt-2 min-h-[150px]"
            />
            <p className="text-xs text-muted-foreground mt-2">
              💡 Include: Years of experience, key skills, major achievements, and career goals
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsSummaryModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSummary} disabled={!summaryInput.trim()}>
              Update Summary
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating ATS Score Badge (visible in edit/editor tabs) */}
      {selectedResume && (activeTab === 'editor' || activeTab === 'edit') && (
        <FloatingATSScoreBadge
          score={selectedResume.atsScore}
          onExpand={() => setActiveTab('optimize')}
        />
      )}
    </div>
  );
}

