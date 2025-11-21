"use client";

import { useState } from 'react';
import { Sparkles, Rocket, Target, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: {
    useTemplate: boolean;
    name: string;
    email: string;
    phone: string;
    title: string;
  }) => void;
}

export function OnboardingWizard({ isOpen, onClose, onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
  });

  const handleStartFromScratch = () => {
    setStep(2);
  };

  const handleUseSample = () => {
    onComplete({
      useTemplate: true,
      name: '',
      email: '',
      phone: '',
      title: '',
    });
    onClose();
  };

  const handleFinish = () => {
    if (!formData.name || !formData.email) {
      alert('Please fill in at least your name and email');
      return;
    }

    onComplete({
      useTemplate: false,
      ...formData,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Welcome to Resume Builder!
              </DialogTitle>
              <DialogDescription>
                Let&apos;s get you started with creating your professional resume
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                onClick={handleUseSample}
                className="group p-6 border-2 rounded-lg hover:border-primary transition-all hover:shadow-lg"
              >
                <Rocket className="h-12 w-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2">Start with Sample</h3>
                <p className="text-sm text-muted-foreground">
                  See an example resume with pre-filled data to get inspiration
                </p>
                <Badge className="mt-4" variant="secondary">
                  Recommended
                </Badge>
              </button>

              <button
                onClick={handleStartFromScratch}
                className="group p-6 border-2 rounded-lg hover:border-primary transition-all hover:shadow-lg"
              >
                <Target className="h-12 w-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2">Start from Scratch</h3>
                <p className="text-sm text-muted-foreground">
                  Begin with a blank canvas and build your resume from ground up
                </p>
              </button>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                What you&apos;ll get:
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                <li>Professional templates (Modern, Classic, Creative)</li>
                <li>ATS-friendly formatting with real-time score</li>
                <li>Export to PDF, DOCX, and Plain Text</li>
                <li>Version history to track changes</li>
                <li>AI-powered suggestions for improvements</li>
              </ul>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Basic Information</DialogTitle>
              <DialogDescription>
                Tell us a bit about yourself to get started
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.doe@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Phone Number</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Job Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Software Engineer"
                />
              </div>
            </div>

            <div className="flex justify-between mt-6 pt-4 border-t">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleFinish}>
                Create My Resume
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
