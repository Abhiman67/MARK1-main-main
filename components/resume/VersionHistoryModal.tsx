"use client";

import { memo } from 'react';
import { History, Clock, Eye, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Resume } from '@/hooks/useATSScore';
import type { ResumeVersion } from '@/hooks/useVersionHistory';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: Resume | null;
  onSaveVersion: (label: string) => void;
  onRestoreVersion: (versionId: string) => void;
  onPreviewVersion?: (versionId: string) => void;
}

export const VersionHistoryModal = memo(function VersionHistoryModal({
  isOpen,
  onClose,
  resume,
  onSaveVersion,
  onRestoreVersion,
  onPreviewVersion,
}: VersionHistoryModalProps) {
  const versions = resume?.versions || [];

  const handleSaveVersion = () => {
    const label = prompt('Enter version label:', 'Manual Save');
    if (label) {
      onSaveVersion(label);
    }
  };

  const handleRestore = (versionId: string, versionLabel: string) => {
    if (confirm(`Restore "${versionLabel}"? Your current changes will be saved as a new version.`)) {
      onSaveVersion('Auto-save before restore');
      onRestoreVersion(versionId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Version History - {resume?.name || 'Resume'}
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
                    Last modified: {resume?.lastModified ? new Date(resume.lastModified).toLocaleDateString() : 'N/A'} at{' '}
                    {resume?.lastModified ? new Date(resume.lastModified).toLocaleTimeString() : 'N/A'}
                  </p>
                  <div className="mt-2 text-sm">
                    <p className="text-muted-foreground">
                      {resume?.experience?.length || 0} experiences • {resume?.education?.length || 0} education •{' '}
                      {resume?.skills?.length || 0} skills
                    </p>
                  </div>
                </div>
                <Button size="sm" onClick={handleSaveVersion}>
                  <Clock className="h-4 w-4 mr-2" />
                  Save Version
                </Button>
              </div>
            </div>

            {/* Saved Versions */}
            {versions.length > 0 ? (
              [...versions].reverse().map((version: ResumeVersion, index: number) => (
                <div
                  key={version.id}
                  className="border-l-4 border-gray-300 pl-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{version.label}</span>
                        <Badge variant="outline" className="text-xs">
                          v{versions.length - index}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(version.timestamp).toLocaleDateString()} at{' '}
                        {new Date(version.timestamp).toLocaleTimeString()}
                      </p>
                      <div className="mt-2 text-sm">
                        <p className="text-muted-foreground">
                          {version.data.experience?.length || 0} experiences • {version.data.education?.length || 0}{' '}
                          education • {version.data.skills?.length || 0} skills
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {onPreviewVersion && (
                        <Button size="sm" variant="outline" onClick={() => onPreviewVersion(version.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      )}
                      <Button size="sm" onClick={() => handleRestore(version.id, version.label)}>
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
          <p className="text-sm text-muted-foreground">{versions.length} of 10 versions saved</p>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
