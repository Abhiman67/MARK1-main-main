"use client";

import { History, Eye, RotateCcw, Clock, FileText, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

interface ResumeVersion {
  id: string;
  timestamp: Date;
  label: string;
  thumbnail?: string;
  changes?: string[];
  data: any;
}

interface VersionHistoryImprovedProps {
  isOpen: boolean;
  onClose: () => void;
  currentVersion: {
    experience: any[];
    education: any[];
    skills: string[];
    lastModified: Date;
  };
  versions: ResumeVersion[];
  onSave: (label: string) => void;
  onRestore: (versionId: string) => void;
  onPreview: (versionId: string) => void;
  onDelete?: (versionId: string) => void;
}

export function VersionHistoryImproved({
  isOpen,
  onClose,
  currentVersion,
  versions,
  onSave,
  onRestore,
  onPreview,
  onDelete,
}: VersionHistoryImprovedProps) {
  const handleSaveVersion = () => {
    const label = prompt('Enter version label:', 'Manual Save');
    if (label) onSave(label);
  };

  const getSummary = (data: any) => {
    return {
      experience: data.experience?.length || 0,
      education: data.education?.length || 0,
      skills: data.skills?.length || 0,
    };
  };

  const getChangesSummary = (version: ResumeVersion, index: number): string[] => {
    if (index === versions.length - 1) return ['Initial version'];
    
    const changes: string[] = [];
    const current = getSummary(version.data);
    const previous = getSummary(versions[index + 1].data);
    
    if (current.experience !== previous.experience) {
      const diff = current.experience - previous.experience;
      changes.push(`${diff > 0 ? '+' : ''}${diff} experience entries`);
    }
    if (current.education !== previous.education) {
      const diff = current.education - previous.education;
      changes.push(`${diff > 0 ? '+' : ''}${diff} education entries`);
    }
    if (current.skills !== previous.skills) {
      const diff = current.skills - previous.skills;
      changes.push(`${diff > 0 ? '+' : ''}${diff} skills`);
    }
    
    return changes.length > 0 ? changes : ['No major changes'];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Version History
          </DialogTitle>
          <DialogDescription>
            Track and restore previous versions of your resume
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 py-4">
            {/* Current Version */}
            <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50 dark:bg-blue-950">
              <div className="flex items-start gap-4">
                {/* Thumbnail placeholder */}
                <div className="w-32 h-40 bg-white dark:bg-gray-800 border rounded flex items-center justify-center flex-shrink-0">
                  <FileText className="h-12 w-12 text-muted-foreground opacity-50" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-500">Current</Badge>
                    <span className="text-sm font-semibold">Working Version</span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        Last modified: {currentVersion.lastModified.toLocaleDateString()} at{' '}
                        {currentVersion.lastModified.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline">
                      {currentVersion.experience.length} experiences
                    </Badge>
                    <Badge variant="outline">
                      {currentVersion.education.length} education
                    </Badge>
                    <Badge variant="outline">
                      {currentVersion.skills.length} skills
                    </Badge>
                  </div>

                  <Button size="sm" onClick={handleSaveVersion}>
                    <Clock className="h-4 w-4 mr-2" />
                    Save Current Version
                  </Button>
                </div>
              </div>
            </div>

            {/* Saved Versions */}
            {versions.length > 0 ? (
              [...versions].reverse().map((version, reverseIndex) => {
                const index = versions.length - 1 - reverseIndex;
                const summary = getSummary(version.data);
                const changes = getChangesSummary(version, index);

                return (
                  <div
                    key={version.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Thumbnail placeholder */}
                      <div className="w-32 h-40 bg-gray-100 dark:bg-gray-800 border rounded flex items-center justify-center flex-shrink-0">
                        <FileText className="h-12 w-12 text-muted-foreground opacity-50" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold">{version.label}</span>
                          <Badge variant="outline" className="text-xs">
                            v{versions.length - index}
                          </Badge>
                        </div>

                        <div className="text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {version.timestamp.toLocaleDateString()} at{' '}
                              {version.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          
                          {changes.length > 0 && (
                            <div className="ml-6 space-y-1">
                              <span className="font-medium">Changes:</span>
                              {changes.map((change, i) => (
                                <div key={i} className="text-xs">
                                  • {change}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline">{summary.experience} experiences</Badge>
                          <Badge variant="outline">{summary.education} education</Badge>
                          <Badge variant="outline">{summary.skills} skills</Badge>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onPreview(version.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              if (
                                confirm(
                                  'Restore this version? Your current changes will be saved automatically.'
                                )
                              ) {
                                onRestore(version.id);
                              }
                            }}
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Restore
                          </Button>
                          {onDelete && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                if (confirm('Delete this version? This cannot be undone.')) {
                                  onDelete(version.id);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <History className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No Saved Versions Yet</p>
                <p className="text-sm mb-4">
                  Click &quot;Save Current Version&quot; to create a snapshot
                </p>
                <Button onClick={handleSaveVersion}>
                  <Clock className="h-4 w-4 mr-2" />
                  Save Your First Version
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {versions.length} of 10 versions saved
          </p>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
