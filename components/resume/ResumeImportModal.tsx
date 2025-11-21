"use client";

import { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, Check, Loader2, Type } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import type { ImportedResumeData } from '@/lib/resume-import';

interface ResumeImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: ImportedResumeData) => void;
}

export function ResumeImportModal({ open, onOpenChange, onImport }: ResumeImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importedData, setImportedData] = useState<ImportedResumeData | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, []);

  const handleFileSelect = async (selectedFile: File) => {
    setError(null);
    setImportedData(null);
    
    const fileType = selectedFile.name.toLowerCase().split('.').pop();
    if (fileType !== 'pdf' && fileType !== 'docx' && fileType !== 'txt') {
      setError('Please upload a PDF, DOCX, or TXT file');
      return;
    }

    setFile(selectedFile);
    setImporting(true);

    try {
      // Import directly on client side
      const { importResume } = await import('@/lib/resume-import');
      const data = await importResume(selectedFile);
      setImportedData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import resume');
      setFile(null);
    } finally {
      setImporting(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleConfirmImport = () => {
    if (importedData) {
      onImport(importedData);
      onOpenChange(false);
      // Reset state
      setFile(null);
      setImportedData(null);
      setError(null);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setImportedData(null);
    setError(null);
    setPastedText('');
    setMode('upload');
    onOpenChange(false);
  };

  const handlePasteImport = async () => {
    if (!pastedText.trim()) {
      setError('Please paste some text');
      return;
    }

    setImporting(true);
    setError(null);

    try {
      const { parseResumeText } = await import('@/lib/resume-import');
      const data = parseResumeText(pastedText);
      setImportedData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse text');
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Import Resume</DialogTitle>
          <DialogDescription>
            Upload a file or paste your resume text to automatically extract information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!file && !importedData && (
            <Tabs value={mode} onValueChange={(v) => setMode(v as 'upload' | 'paste')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </TabsTrigger>
                <TabsTrigger value="paste">
                  <Type className="h-4 w-4 mr-2" />
                  Paste Text
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-4">
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-lg p-12 text-center transition-colors
                    ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}
                  `}
                >
                  <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">
                      Drop your resume here or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports TXT files. PDF/DOCX support is experimental.
                    </p>
                  </label>
                </div>
              </TabsContent>
              
              <TabsContent value="paste" className="mt-4">
                <div className="space-y-3">
                  <Textarea
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste your resume text here..."
                    className="min-h-[300px] font-mono text-sm"
                  />
                  <Button 
                    onClick={handlePasteImport}
                    disabled={!pastedText.trim() || importing}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
                  >
                    {importing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Import Resume
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {importing && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
              <p className="text-lg font-medium">Analyzing resume...</p>
              <p className="text-sm text-muted-foreground">This may take a few seconds</p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {importedData && (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                <Alert>
                  <Check className="h-4 w-4" />
                  <AlertDescription>
                    Resume parsed successfully! Review the extracted information below.
                  </AlertDescription>
                </Alert>

                {/* Personal Info */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {importedData.personalInfo.fullName && (
                      <div>
                        <span className="text-muted-foreground">Name:</span>
                        <p className="font-medium">{importedData.personalInfo.fullName}</p>
                      </div>
                    )}
                    {importedData.personalInfo.email && (
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <p className="font-medium">{importedData.personalInfo.email}</p>
                      </div>
                    )}
                    {importedData.personalInfo.phone && (
                      <div>
                        <span className="text-muted-foreground">Phone:</span>
                        <p className="font-medium">{importedData.personalInfo.phone}</p>
                      </div>
                    )}
                    {importedData.personalInfo.title && (
                      <div>
                        <span className="text-muted-foreground">Title:</span>
                        <p className="font-medium">{importedData.personalInfo.title}</p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Skills */}
                {importedData.skills.length > 0 && (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3">Skills ({importedData.skills.length})</h3>
                    <div className="flex flex-wrap gap-2">
                      {importedData.skills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Summary */}
                {importedData.summary && (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3">Summary</h3>
                    <p className="text-sm text-muted-foreground">{importedData.summary}</p>
                  </Card>
                )}

                {/* Links */}
                {importedData.links.length > 0 && (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3">Links ({importedData.links.length})</h3>
                    <div className="space-y-2">
                      {importedData.links.map((link, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Badge variant="outline">{link.type}</Badge>
                          <span className="text-muted-foreground truncate">{link.url}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Note: Experience, education, and other complex sections require manual review after import.
                    You can edit all information after importing.
                  </AlertDescription>
                </Alert>
              </div>
            </ScrollArea>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          {importedData && (
            <Button onClick={handleConfirmImport} className="bg-gradient-to-r from-blue-500 to-purple-600">
              Import Resume
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
