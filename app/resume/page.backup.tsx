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
  RotateCcw
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from 'docx';
import { saveAs } from 'file-saver';
import { ResumeTemplate, type ResumeData, type TemplateType } from '@/components/resume/templates';

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
  template: 'modern' | 'classic' | 'creative';
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
  versions: ResumeVersion[];
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
    versions: [],
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
];

const DEFAULT_AI_SUGGESTIONS = [
  {
    type: 'improvement',
    title: 'Add quantified achievements',
    description: 'Include specific numbers and metrics in your experience section',
    impact: 'high',
  },
  {
    type: 'keyword',
    title: 'Include more technical keywords',
    description: 'Add React, TypeScript, and Node.js to improve ATS matching',
    impact: 'medium',
  },
  {
    type: 'format',
    title: 'Optimize section order',
    description: 'Move skills section higher for better visibility',
    impact: 'low',
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

  // Clamp
  score = Math.max(10, Math.min(95, Math.round(score)));
  return score;
};

const generateSuggestions = (r: Resume) => {
  if (!r) return [] as any[];
  const suggestions: any[] = [];

  // Missing contact info
  if (!r.personalInfo.email || !r.personalInfo.phone) {
    suggestions.push({ type: 'improvement', title: 'Add contact information', description: 'Include a phone number and email for recruiters to reach you', impact: 'high' });
  }

  // Short summary
  if (!(r.summary || '').trim() || (r.summary || '').trim().length < 60) {
    suggestions.push({ type: 'improvement', title: 'Expand your professional summary', description: 'Write a concise summary with your role, years of experience and top skills', impact: 'medium' });
  }

  // Skills - missing keywords
  const missingKeywords = KEYWORDS.filter(k => !r.skills.map(s=>s.toLowerCase()).includes(k));
  if (missingKeywords.length > 0) {
    suggestions.push({ type: 'keyword', title: 'Add technical keywords', description: `Consider adding: ${missingKeywords.slice(0,5).join(', ')}`, impact: 'medium', keywords: missingKeywords.slice(0,5) });
  }

  // Quantified achievements
  const totalAchievements = r.experience.reduce((acc, e) => acc + (e.achievements?.length || 0), 0);
  if (totalAchievements < Math.max(3, (r.experience.length * 2))) {
    suggestions.push({ type: 'improvement', title: 'Add more achievements', description: 'Aim for 2-4 achievements per role, include metrics where possible', impact: 'high' });
  }

  // Section order suggestion (low impact)
  suggestions.push({ type: 'format', title: 'Bring Skills higher', description: 'Place Skills near the top for better ATS and recruiter scanning', impact: 'low' });

  return suggestions;
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

  // After mount, hydrate any locally persisted resumes; defer changes until mounted to keep SSR markup identical.
  useEffect(() => {
    setMounted(true);
    try {
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

  const persist = useCallback((list: Resume[]) => {
    setResumesList(list);
    
    // Debounce localStorage writes to prevent blocking UI
    if (persistTimeoutRef.current) {
      clearTimeout(persistTimeoutRef.current);
    }
    
    persistTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(list.map((r) => ({ 
            ...r, 
            lastModified: r.lastModified.toISOString(),
            versions: (r.versions || []).map(v => ({
              ...v,
              timestamp: v.timestamp.toISOString()
            }))
          })))
        );
      } catch {}
    }, 1000); // Wait 1 second after last change
  }, []);

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
      versions: [],
    };
    const list = [...resumesList, newResume];
    persist(list);
    setSelectedId(newResume.id);
  };

  const duplicateSelected = () => {
    if (!selectedResume) return;
    const copy: Resume = {
      ...selectedResume,
      id: Date.now().toString(),
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
      id: Date.now().toString(),
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
      id: Date.now().toString(),
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
      id: Date.now().toString(),
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
      id: Date.now().toString(),
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
      id: Date.now().toString(),
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
      id: Date.now().toString(),
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

  // --- Optimize / ATS analysis utilities ---
  const KEYWORDS = [
    'react', 'typescript', 'node', 'node.js', 'javascript', 'python', 'aws', 'sql', 'java', 'docker'
  ];

  const [aiSuggestionsState, setAiSuggestionsState] = useState<typeof DEFAULT_AI_SUGGESTIONS>(DEFAULT_AI_SUGGESTIONS);

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

  const generateSuggestions = (r: Resume) => {
    if (!r) return [] as any[];
    const suggestions: any[] = [];

    // Missing contact info
    if (!r.personalInfo.email || !r.personalInfo.phone) {
      suggestions.push({ type: 'improvement', title: 'Add contact information', description: 'Include a phone number and email for recruiters to reach you', impact: 'high' });
    }

    // Short summary
    if (!(r.summary || '').trim() || (r.summary || '').trim().length < 60) {
      suggestions.push({ type: 'improvement', title: 'Expand your professional summary', description: 'Write a concise summary with your role, years of experience and top skills', impact: 'medium' });
    }

    // Skills - missing keywords
    const missingKeywords = KEYWORDS.filter(k => !r.skills.map(s=>s.toLowerCase()).includes(k));
    if (missingKeywords.length > 0) {
      suggestions.push({ type: 'keyword', title: 'Add technical keywords', description: `Consider adding: ${missingKeywords.slice(0,5).join(', ')}`, impact: 'medium', keywords: missingKeywords.slice(0,5) });
    }

    // Quantified achievements
    const totalAchievements = r.experience.reduce((acc, e) => acc + (e.achievements?.length || 0), 0);
    if (totalAchievements < Math.max(3, (r.experience.length * 2))) {
      suggestions.push({ type: 'improvement', title: 'Add more achievements', description: 'Aim for 2-4 achievements per role, include metrics where possible', impact: 'high' });
    }

    // Section order suggestion (low impact)
    suggestions.push({ type: 'format', title: 'Bring Skills higher', description: 'Place Skills near the top for better ATS and recruiter scanning', impact: 'low' });

    return suggestions;
  };

  const analyzeResume = (r: Resume | null) => {
    if (!r) return;
    const score = computeATSScore(r);
    // update resume score in list
    const updated = resumesList.map(rr => rr.id === r.id ? { ...rr, atsScore: score, lastModified: new Date() } : rr);
    persist(updated);
    // set suggestions
    const generated = generateSuggestions(r);
    setAiSuggestionsState(generated);
  };

  const handleApplySuggestion = (index: number) => {
    if (!selectedResume) return;
    const suggestion = aiSuggestionsState[index];
    if (!suggestion) return;

    if (suggestion.type === 'keyword' && (suggestion as any).keywords) {
      // add keywords to skills
      const newSkills = Array.from(new Set([...selectedResume.skills, ...(suggestion as any).keywords]));
      updateResumeField('skills', newSkills);
    } else if (suggestion.type === 'improvement' && suggestion.title.includes('achievements')) {
      // add a placeholder quantified achievement to first experience
      if (selectedResume.experience.length > 0) {
        const expId = selectedResume.experience[0].id;
        addAchievement(expId, 'Improved key metric by 20% (example)');
      }
    } else if (suggestion.type === 'improvement' && suggestion.title.includes('summary')) {
      updateResumeField('summary', (selectedResume.summary || '') + '\nFocused software engineer with X years of experience in Y, skilled in Z.');
    } else if (suggestion.type === 'format') {
      // no-op for now; we could move section order client-side when templates are implemented
    }

    // re-analyze after applying
    setTimeout(() => {
      const r = resumesList.find(rr => rr.id === selectedId) || null;
      analyzeResume(r);
    }, 150);
  };

  // Memoize ATS score to avoid expensive recalculation
  const currentATSScore = useMemo(() => {
    if (!selectedResume) return 0;
    return computeATSScore(selectedResume);
  }, [
    selectedResume?.personalInfo,
    selectedResume?.experience?.length,
    selectedResume?.education?.length,
    selectedResume?.skills?.length,
    selectedResume?.projects?.length,
    selectedResume?.certifications?.length
  ]);

  // Memoize AI suggestions to avoid expensive regeneration
  const currentSuggestions = useMemo(() => {
    if (!selectedResume) return [];
    return generateSuggestions(selectedResume);
  }, [
    selectedResume?.summary,
    selectedResume?.experience?.length,
    selectedResume?.skills?.length,
    currentATSScore
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
    setAiSuggestionsState(currentSuggestions as any);
  }, [mounted, selectedResume?.id, currentATSScore, currentSuggestions]);


  const handleDownloadPDF = async () => {
    if (!selectedResume) return;

    try {
      // Get the resume preview element
      const element = document.getElementById('resume-preview-modal') || document.getElementById('resume-preview');
      if (!element) {
        console.error('Resume preview element not found');
        return;
      }

      // Capture the resume as canvas with high quality
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200,
        windowHeight: element.scrollHeight,
      });

      // Calculate PDF dimensions (A4: 210mm x 297mm)
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: imgHeight > 297 ? 'portrait' : 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Add image to PDF
      let position = 0;
      const pageHeight = 297; // A4 height in mm
      let heightLeft = imgHeight;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate filename
      const fileName = `${selectedResume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf` || 'Resume.pdf';
      
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
      const fileName = `${selectedResume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.json` || 'Resume.json';
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
          const startDate = exp.startDate ? new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
          const endDate = exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '');
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
          const startDate = proj.startDate ? new Date(proj.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
          const endDate = proj.current ? 'Present' : (proj.endDate ? new Date(proj.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '');
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
          const startDate = edu.startDate ? new Date(edu.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
          const endDate = edu.endDate ? new Date(edu.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
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
          const date = cert.date ? new Date(cert.date + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
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
      const fileName = `${r.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.txt` || 'Resume.txt';
      saveAs(dataBlob, fileName);
    } catch (error) {
      console.error('Error exporting plain text:', error);
      alert('Failed to export plain text. Please try again.');
    }
  }, [selectedResume]);

  const handleExportDOCX = useCallback(async () => {
    if (!selectedResume) return;
    
    try {
      const r = selectedResume;
      const sections = [];
      
      // Header
      sections.push(
        new Paragraph({
          text: r.personalInfo.fullName,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        })
      );
      
      if (r.personalInfo.title) {
        sections.push(
          new Paragraph({
            text: r.personalInfo.title,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          })
        );
      }
      
      // Contact Info
      const contactParts = [];
      if (r.personalInfo.email) contactParts.push(r.personalInfo.email);
      if (r.personalInfo.phone) contactParts.push(r.personalInfo.phone);
      if (r.personalInfo.location) contactParts.push(r.personalInfo.location);
      
      if (contactParts.length > 0) {
        sections.push(
          new Paragraph({
            text: contactParts.join(' | '),
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          })
        );
      }
      
      // Links
      if (r.links && r.links.length > 0) {
        sections.push(
          new Paragraph({
            text: 'LINKS',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );
        r.links.forEach(link => {
          sections.push(
            new Paragraph({
              text: `${link.type}: ${link.url}`,
              spacing: { after: 100 },
            })
          );
        });
      }
      
      // Summary
      if (r.summary) {
        sections.push(
          new Paragraph({
            text: 'PROFESSIONAL SUMMARY',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: r.summary,
            spacing: { after: 200 },
          })
        );
      }
      
      // Skills
      if (r.skills.length > 0) {
        sections.push(
          new Paragraph({
            text: 'SKILLS',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: r.skills.join(' • '),
            spacing: { after: 200 },
          })
        );
      }
      
      // Experience
      if (r.experience.length > 0) {
        sections.push(
          new Paragraph({
            text: 'EXPERIENCE',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );
        
        r.experience.forEach((exp, idx) => {
          const startDate = exp.startDate ? new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
          const endDate = exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '');
          
          sections.push(
            new Paragraph({
              children: [
                new TextRun({ text: exp.position, bold: true }),
                new TextRun({ text: ` at ${exp.company}` }),
              ],
              spacing: { before: idx > 0 ? 150 : 0, after: 50 },
            }),
            new Paragraph({
              text: `${startDate} - ${endDate}`,
              spacing: { after: 100 },
            })
          );
          
          if (exp.description) {
            sections.push(
              new Paragraph({
                text: exp.description,
                spacing: { after: 100 },
              })
            );
          }
          
          exp.achievements.forEach(ach => {
            sections.push(
              new Paragraph({
                text: ach,
                bullet: { level: 0 },
                spacing: { after: 50 },
              })
            );
          });
        });
      }
      
      // Projects
      if (r.projects && r.projects.length > 0) {
        sections.push(
          new Paragraph({
            text: 'PROJECTS',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );
        
        r.projects.forEach((proj, idx) => {
          const startDate = proj.startDate ? new Date(proj.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
          const endDate = proj.current ? 'Present' : (proj.endDate ? new Date(proj.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '');
          
          sections.push(
            new Paragraph({
              children: [
                new TextRun({ text: proj.name, bold: true }),
              ],
              spacing: { before: idx > 0 ? 150 : 0, after: 50 },
            }),
            new Paragraph({
              text: `${startDate} - ${endDate}`,
              spacing: { after: 50 },
            }),
            new Paragraph({
              text: proj.description,
              spacing: { after: 100 },
            })
          );
          
          if (proj.technologies.length > 0) {
            sections.push(
              new Paragraph({
                text: `Technologies: ${proj.technologies.join(', ')}`,
                spacing: { after: 100 },
              })
            );
          }
          
          proj.highlights.forEach(h => {
            sections.push(
              new Paragraph({
                text: h,
                bullet: { level: 0 },
                spacing: { after: 50 },
              })
            );
          });
        });
      }
      
      // Education
      if (r.education.length > 0) {
        sections.push(
          new Paragraph({
            text: 'EDUCATION',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );
        
        r.education.forEach((edu, idx) => {
          const startDate = edu.startDate ? new Date(edu.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
          const endDate = edu.endDate ? new Date(edu.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
          
          sections.push(
            new Paragraph({
              children: [
                new TextRun({ text: edu.degree, bold: true }),
                new TextRun({ text: ` in ${edu.field}` }),
              ],
              spacing: { before: idx > 0 ? 150 : 0, after: 50 },
            }),
            new Paragraph({
              text: edu.institution,
              spacing: { after: 50 },
            }),
            new Paragraph({
              text: `${startDate} - ${endDate}`,
              spacing: { after: edu.gpa ? 50 : 100 },
            })
          );
          
          if (edu.gpa) {
            sections.push(
              new Paragraph({
                text: `GPA: ${edu.gpa}`,
                spacing: { after: 100 },
              })
            );
          }
        });
      }
      
      // Certifications
      if (r.certifications && r.certifications.length > 0) {
        sections.push(
          new Paragraph({
            text: 'CERTIFICATIONS',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );
        
        r.certifications.forEach((cert, idx) => {
          const date = cert.date ? new Date(cert.date + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
          
          sections.push(
            new Paragraph({
              children: [
                new TextRun({ text: cert.name, bold: true }),
              ],
              spacing: { before: idx > 0 ? 150 : 0, after: 50 },
            }),
            new Paragraph({
              text: cert.issuer,
              spacing: { after: 50 },
            }),
            new Paragraph({
              text: `Issued: ${date}`,
              spacing: { after: cert.credentialId || cert.link ? 50 : 100 },
            })
          );
          
          if (cert.credentialId) {
            sections.push(
              new Paragraph({
                text: `Credential ID: ${cert.credentialId}`,
                spacing: { after: 50 },
              })
            );
          }
        });
      }
      
      // Languages
      if (r.languages && r.languages.length > 0) {
        sections.push(
          new Paragraph({
            text: 'LANGUAGES',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );
        
        r.languages.forEach(lang => {
          sections.push(
            new Paragraph({
              text: `${lang.name}: ${lang.proficiency}`,
              spacing: { after: 50 },
            })
          );
        });
      }
      
      const doc = new Document({
        sections: [{
          properties: {},
          children: sections,
        }],
      });
      
      const blob = await Packer.toBlob(doc);
      const fileName = `${r.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.docx` || 'Resume.docx';
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Error exporting DOCX:', error);
      alert('Failed to export DOCX. Please try again.');
    }  }, [selectedResume]);

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
              </h1>
              <p className="text-muted-foreground">
                {selectedResume 
                  ? `Editing "${selectedResume.name}" • ${resumesList.length} resume${resumesList.length !== 1 ? 's' : ''} total`
                  : `${resumesList.length} resume${resumesList.length !== 1 ? 's' : ''} • Create your first ATS-optimized resume`
                }
              </p>
            </div>
            <Dialog open={isNewResumeOpen} onOpenChange={setIsNewResumeOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Resume
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
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
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
                    <h3 className="text-lg font-semibold mb-4">Template Style</h3>
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
                      <h3 className="text-lg font-semibold">ATS Score</h3>
                      <Zap className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${getScoreColor(selectedResume?.atsScore || 0)}`}>
                        {selectedResume?.atsScore}%
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {getScoreLabel(selectedResume?.atsScore || 0)}
                      </p>
                      <Progress value={selectedResume?.atsScore || 0} className="h-3" />
                    </div>
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
                <GlassCard className="p-6 mt-6" gradient>
                    <div className="flex items-center space-x-2 mb-4">
                      <Zap className="h-5 w-5 text-purple-500" />
                      <h3 className="text-lg font-semibold">AI Suggestions</h3>
                    </div>
                  <div className="space-y-4">
                    {aiSuggestionsState.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                        <p className="text-lg font-medium text-green-500">Perfect Resume!</p>
                        <p className="text-sm mt-1">No suggestions - your resume looks great</p>
                      </div>
                    )}
                    {aiSuggestionsState.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3 p-4 rounded-lg bg-white/5"
                      >
                        <div className={`rounded-full p-2 ${
                          suggestion.impact === 'high' ? 'bg-red-500/20 text-red-500' :
                          suggestion.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-green-500/20 text-green-500'
                        }`}>
                          {suggestion.impact === 'high' ? <AlertCircle className="h-4 w-4" /> :
                           suggestion.impact === 'medium' ? <AlertCircle className="h-4 w-4" /> :
                           <CheckCircle className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{suggestion.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {suggestion.description}
                          </p>
                          <Badge variant="outline" className={
                            suggestion.impact === 'high' ? 'border-red-500/50 text-red-500' :
                            suggestion.impact === 'medium' ? 'border-yellow-500/50 text-yellow-500' :
                            'border-green-500/50 text-green-500'
                          }>
                            {suggestion.impact} impact
                          </Badge>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => handleApplySuggestion(index)}>
                          Apply
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
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
                          <Input
                            placeholder="Full Name"
                            value={selectedResume?.personalInfo.fullName || ''}
                            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                          />
                          <Input
                            placeholder="Job Title"
                            value={selectedResume?.personalInfo.title || ''}
                            onChange={(e) => updatePersonalInfo('title', e.target.value)}
                          />
                          <Input
                            placeholder="Email Address"
                            type="email"
                            value={selectedResume?.personalInfo.email || ''}
                            onChange={(e) => updatePersonalInfo('email', e.target.value)}
                          />
                          <Input
                            placeholder="Phone Number"
                            value={selectedResume?.personalInfo.phone || ''}
                            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                          />
                          <Input
                            placeholder="Location"
                            value={selectedResume?.personalInfo.location || ''}
                            onChange={(e) => updatePersonalInfo('location', e.target.value)}
                          />
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
                        <Input
                          placeholder="Add skills separated by commas"
                          value={skillsInput}
                          onChange={(e) => updateSkills(e.target.value)}
                        />
                        {selectedResume && selectedResume.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {selectedResume.skills.map((skill, idx) => (
                              <Badge key={idx} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
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
                                  <Input
                                    type="month"
                                    placeholder="Start Date"
                                    value={exp.startDate}
                                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                  />
                                  <Input
                                    type="month"
                                    placeholder="End Date"
                                    value={exp.endDate}
                                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                    disabled={exp.current}
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={exp.current}
                                    onChange={(e) => {
                                      updateExperience(exp.id, 'current', e.target.checked);
                                      if (e.target.checked) updateExperience(exp.id, 'endDate', '');
                                    }}
                                    className="rounded"
                                  />
                                  <label className="text-sm">Currently working here</label>
                                </div>
                                <Textarea
                                  placeholder="Brief description"
                                  value={exp.description}
                                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                  rows={2}
                                />
                                <div>
                                  <label className="text-sm font-medium mb-2 block">Key Achievements</label>
                                  {exp.achievements.map((ach, idx) => (
                                    <div key={idx} className="flex items-center gap-2 mb-2">
                                      <span className="text-xs">•</span>
                                      <Input
                                        value={ach}
                                        onChange={(e) => {
                                          const newAchievements = [...exp.achievements];
                                          newAchievements[idx] = e.target.value;
                                          updateExperience(exp.id, 'achievements', newAchievements);
                                        }}
                                        className="flex-1"
                                      />
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => deleteAchievement(exp.id, idx)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => addAchievement(exp.id, '')}
                                    className="mt-2"
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add Achievement
                                  </Button>
                                </div>
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
                                <Input
                                  type="month"
                                  placeholder="Start"
                                  value={edu.startDate}
                                  onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                />
                                <Input
                                  type="month"
                                  placeholder="End"
                                  value={edu.endDate}
                                  onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
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
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold flex items-center">
                            <Code className="h-5 w-5 mr-2" />
                            Projects
                          </h3>
                          <Button size="sm" variant="outline" onClick={addProject}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                        <ScrollArea className="h-96">
                          <div className="space-y-4 pr-4">
                            {selectedResume && (!selectedResume.projects || selectedResume.projects.length === 0) && (
                              <div className="text-center py-12 text-muted-foreground">
                                <Code className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p className="text-sm">No projects added yet</p>
                                <p className="text-xs mt-1">Showcase your portfolio and side projects</p>
                              </div>
                            )}
                            {selectedResume?.projects?.map((project) => (
                              <div key={project.id} className="p-4 rounded-lg border border-white/20 bg-white/5 space-y-3">
                                <div className="flex items-center justify-between">
                                  <Input
                                    placeholder="Project Name"
                                    value={project.name}
                                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                                    className="flex-1 mr-2"
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => deleteProject(project.id)}
                                    className="text-red-500"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <Textarea
                                  placeholder="Project description"
                                  value={project.description}
                                  onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                                  rows={2}
                                />
                                <Input
                                  placeholder="Technologies (comma-separated)"
                                  value={project.technologies.join(', ')}
                                  onChange={(e) => {
                                    const techs = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                                    updateProject(project.id, 'technologies', techs);
                                  }}
                                />
                                <Input
                                  placeholder="Project Link (optional)"
                                  value={project.link || ''}
                                  onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    type="month"
                                    placeholder="Start Date"
                                    value={project.startDate}
                                    onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                                  />
                                  <Input
                                    type="month"
                                    placeholder="End Date"
                                    value={project.endDate}
                                    onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                                    disabled={project.current}
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={project.current}
                                    onChange={(e) => {
                                      updateProject(project.id, 'current', e.target.checked);
                                      if (e.target.checked) updateProject(project.id, 'endDate', '');
                                    }}
                                    className="rounded"
                                  />
                                  <label className="text-sm">Currently working on this</label>
                                </div>
                                <div>
                                  <label className="text-sm font-medium mb-2 block">Highlights</label>
                                  {project.highlights.map((highlight, idx) => (
                                    <div key={idx} className="flex items-start space-x-2 mb-2">
                                      <Input
                                        value={highlight}
                                        onChange={(e) => {
                                          const updated = [...project.highlights];
                                          updated[idx] = e.target.value;
                                          updateProject(project.id, 'highlights', updated);
                                        }}
                                        className="flex-1"
                                      />
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => deleteProjectHighlight(project.id, idx)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => addProjectHighlight(project.id, '')}
                                    className="mt-2"
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add Highlight
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>

                      {/* Certifications Section */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold flex items-center">
                            <Award className="h-5 w-5 mr-2" />
                            Certifications
                          </h3>
                          <Button size="sm" variant="outline" onClick={addCertification}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                        <div className="space-y-4">
                          {selectedResume && (!selectedResume.certifications || selectedResume.certifications.length === 0) && (
                            <div className="text-center py-12 text-muted-foreground">
                              <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
                              <p className="text-sm">No certifications added yet</p>
                              <p className="text-xs mt-1">Add professional certifications and licenses</p>
                            </div>
                          )}
                          {selectedResume?.certifications?.map((cert) => (
                            <div key={cert.id} className="p-4 rounded-lg border border-white/20 bg-white/5 space-y-3">
                              <div className="flex items-center justify-between">
                                <Input
                                  placeholder="Certification Name"
                                  value={cert.name}
                                  onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                                  className="flex-1 mr-2"
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteCertification(cert.id)}
                                  className="text-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <Input
                                placeholder="Issuing Organization"
                                value={cert.issuer}
                                onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  type="month"
                                  placeholder="Issue Date"
                                  value={cert.date}
                                  onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                                />
                                <Input
                                  type="month"
                                  placeholder="Expiry Date (optional)"
                                  value={cert.expiryDate || ''}
                                  onChange={(e) => updateCertification(cert.id, 'expiryDate', e.target.value)}
                                />
                              </div>
                              <Input
                                placeholder="Credential ID (optional)"
                                value={cert.credentialId || ''}
                                onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                              />
                              <Input
                                placeholder="Verification Link (optional)"
                                value={cert.link || ''}
                                onChange={(e) => updateCertification(cert.id, 'link', e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Languages Section */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold flex items-center">
                            <Languages className="h-5 w-5 mr-2" />
                            Languages
                          </h3>
                          <Button size="sm" variant="outline" onClick={addLanguage}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                        <div className="space-y-4">
                          {selectedResume && (!selectedResume.languages || selectedResume.languages.length === 0) && (
                            <div className="text-center py-12 text-muted-foreground">
                              <Languages className="h-12 w-12 mx-auto mb-3 opacity-50" />
                              <p className="text-sm">No languages added yet</p>
                              <p className="text-xs mt-1">List languages you speak</p>
                            </div>
                          )}
                          {selectedResume?.languages?.map((lang) => (
                            <div key={lang.id} className="p-4 rounded-lg border border-white/20 bg-white/5 flex items-center space-x-3">
                              <Input
                                placeholder="Language"
                                value={lang.name}
                                onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                                className="flex-1"
                              />
                              <select
                                value={lang.proficiency}
                                onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value as Language['proficiency'])}
                                className="px-3 py-2 rounded-md border border-white/20 bg-white/5 text-sm"
                              >
                                <option value="Native">Native</option>
                                <option value="Fluent">Fluent</option>
                                <option value="Professional">Professional</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Basic">Basic</option>
                              </select>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteLanguage(lang.id)}
                                className="text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Portfolio Links Section */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold flex items-center">
                            <LinkIcon className="h-5 w-5 mr-2" />
                            Portfolio & Links
                          </h3>
                          <Button size="sm" variant="outline" onClick={addLink}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                        <div className="space-y-4">
                          {selectedResume && (!selectedResume.links || selectedResume.links.length === 0) && (
                            <div className="text-center py-12 text-muted-foreground">
                              <LinkIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                              <p className="text-sm">No links added yet</p>
                              <p className="text-xs mt-1">Add your GitHub, LinkedIn, portfolio, etc.</p>
                            </div>
                          )}
                          {selectedResume?.links?.map((link) => (
                            <div key={link.id} className="p-4 rounded-lg border border-white/20 bg-white/5 flex items-center space-x-3">
                              <select
                                value={link.type}
                                onChange={(e) => updateLink(link.id, 'type', e.target.value as PortfolioLink['type'])}
                                className="px-3 py-2 rounded-md border border-white/20 bg-white/5 text-sm"
                              >
                                <option value="GitHub">GitHub</option>
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="Portfolio">Portfolio</option>
                                <option value="Website">Website</option>
                                <option value="Other">Other</option>
                              </select>
                              <Input
                                placeholder="URL"
                                value={link.url}
                                onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                                className="flex-1"
                              />
                              <Input
                                placeholder="Label (optional)"
                                value={link.label || ''}
                                onChange={(e) => updateLink(link.id, 'label', e.target.value)}
                                className="w-32"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteLink(link.id)}
                                className="text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Live Preview */}
                    <div className="rounded-lg shadow-lg overflow-hidden">
                      {selectedResume && (
                        <ResumeTemplate 
                          resume={selectedResume as ResumeData} 
                          template={selectedResume.template as TemplateType}
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
                      <div className={`text-6xl font-bold mb-2 ${getScoreColor(selectedResume?.atsScore || 0)}`}>
                        {selectedResume?.atsScore || 0}%
                      </div>
                      <p className="text-lg text-muted-foreground mb-3">
                        {getScoreLabel(selectedResume?.atsScore || 0)}
                      </p>
                      <Progress value={selectedResume?.atsScore || 0} className="h-3" />
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

                  <GlassCard className="p-6" gradient>
                    <div className="flex items-center space-x-2 mb-4">
                      <Zap className="h-5 w-5 text-purple-500" />
                      <h3 className="text-lg font-semibold">AI Suggestions</h3>
                    </div>
                    <ScrollArea className="h-96">
                      <div className="space-y-3 pr-4">
                        {aiSuggestionsState.map((suggestion, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <div className={`rounded-full p-2 ${
                              suggestion.impact === 'high' ? 'bg-red-500/20 text-red-500' :
                              suggestion.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                              'bg-green-500/20 text-green-500'
                            }`}>
                              {suggestion.impact === 'high' ? <AlertCircle className="h-4 w-4" /> :
                               suggestion.impact === 'medium' ? <AlertCircle className="h-4 w-4" /> :
                               <CheckCircle className="h-4 w-4" />}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium mb-1 text-sm">{suggestion.title}</h4>
                              <p className="text-xs text-muted-foreground mb-2">
                                {suggestion.description}
                              </p>
                              <Badge variant="outline" className={
                                suggestion.impact === 'high' ? 'border-red-500/50 text-red-500' :
                                suggestion.impact === 'medium' ? 'border-yellow-500/50 text-yellow-500' :
                                'border-green-500/50 text-green-500'
                              }>
                                {suggestion.impact} impact
                              </Badge>
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => handleApplySuggestion(index)} className="shrink-0">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </GlassCard>
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
    </div>
  );
}

