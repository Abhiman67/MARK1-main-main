import { useCallback, useMemo } from 'react';
import type { Resume } from './useATSScore';

export interface ResumeVersion {
  id: string;
  timestamp: Date;
  label: string;
  data: {
    personalInfo: Resume['personalInfo'];
    summary: string;
    skills: string[];
    experience: Resume['experience'];
    education: Resume['education'];
    projects?: Resume['projects'];
    certifications?: Resume['certifications'];
    languages?: Resume['languages'];
    links?: Resume['links'];
  };
}

export interface UseVersionHistoryReturn {
  versions: ResumeVersion[];
  saveVersion: (label?: string) => string | null;
  restoreVersion: (versionId: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  versionCount: number;
}

/**
 * Hook that manages version history for a resume
 * Handles saving snapshots, restoring previous versions, and version limits
 * 
 * @param resume - Current resume object
 * @param onUpdate - Callback to update the resume when restoring a version
 * @param maxVersions - Maximum number of versions to keep (default: 10)
 */
export function useVersionHistory(
  resume: Resume | null,
  onUpdate: (updatedResume: Partial<Resume>) => void,
  maxVersions: number = 10
): UseVersionHistoryReturn {
  
  const versions = useMemo(() => {
    return resume?.versions || [];
  }, [resume?.versions]);

  /**
   * Creates a deep copy of the resume data and saves it as a version
   * Returns the version ID if successful, null otherwise
   */
  const saveVersion = useCallback((label: string = 'Manual Save'): string | null => {
    if (!resume) return null;

    try {
      const newVersion: ResumeVersion = {
        id: `v-${Date.now()}`,
        timestamp: new Date(),
        label,
        data: {
          // Deep clone to prevent mutations
          personalInfo: JSON.parse(JSON.stringify(resume.personalInfo)),
          summary: resume.summary,
          skills: [...resume.skills],
          experience: JSON.parse(JSON.stringify(resume.experience)),
          education: JSON.parse(JSON.stringify(resume.education)),
          projects: resume.projects ? JSON.parse(JSON.stringify(resume.projects)) : undefined,
          certifications: resume.certifications ? JSON.parse(JSON.stringify(resume.certifications)) : undefined,
          languages: resume.languages ? JSON.parse(JSON.stringify(resume.languages)) : undefined,
          links: resume.links ? JSON.parse(JSON.stringify(resume.links)) : undefined,
        },
      };

      // Keep only the last N versions
      const updatedVersions = [...versions, newVersion].slice(-maxVersions);

      onUpdate({
        versions: updatedVersions,
        lastModified: new Date(),
      });

      return newVersion.id;
    } catch (error) {
      console.error('Error saving version:', error);
      return null;
    }
  }, [resume, versions, maxVersions, onUpdate]);

  /**
   * Restores a resume to a previous version state
   */
  const restoreVersion = useCallback((versionId: string) => {
    if (!resume) return;
    
    const version = versions.find((v: ResumeVersion) => v.id === versionId);
    if (!version) {
      console.warn(`Version ${versionId} not found`);
      return;
    }

    try {
      onUpdate({
        ...version.data,
        lastModified: new Date(),
      });
    } catch (error) {
      console.error('Error restoring version:', error);
    }
  }, [resume, versions, onUpdate]);

  const canUndo = versions.length > 0;
  const canRedo = false; // TODO: Implement redo functionality if needed
  const versionCount = versions.length;

  return {
    versions,
    saveVersion,
    restoreVersion,
    canUndo,
    canRedo,
    versionCount,
  };
}

/**
 * Formats a version timestamp for display
 */
export function formatVersionTimestamp(timestamp: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(timestamp).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

/**
 * Gets a relative time string for version display
 */
export function getVersionTimeString(timestamp: Date): string {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
