"use client";

import { memo } from 'react';
import { Award, Plus, Trash2, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  verificationUrl?: string;
}

interface CertificationsEditorProps {
  certifications: Certification[];
  onChange: (certifications: Certification[]) => void;
}

export const CertificationsEditor = memo(function CertificationsEditor({ 
  certifications, 
  onChange 
}: CertificationsEditorProps) {
  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      credentialId: '',
      verificationUrl: '',
    };
    onChange([...certifications, newCert]);
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    onChange(certifications.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  const removeCertification = (id: string) => {
    onChange(certifications.filter(cert => cert.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Certifications</h3>
        </div>
        <Button onClick={addCertification} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Certification
        </Button>
      </div>

      {certifications.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No certifications added yet</p>
          <Button onClick={addCertification} variant="outline" className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
          </Button>
        </Card>
      )}

      {certifications.map((cert, idx) => (
        <Card key={cert.id} className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
              <span className="text-sm font-medium text-muted-foreground">
                Certification #{idx + 1}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => removeCertification(cert.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`name-${cert.id}`}>Certification Name *</Label>
              <Input
                id={`name-${cert.id}`}
                value={cert.name}
                onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                placeholder="AWS Certified Solutions Architect"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`issuer-${cert.id}`}>Issuing Organization *</Label>
              <Input
                id={`issuer-${cert.id}`}
                value={cert.issuer}
                onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                placeholder="Amazon Web Services"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`date-${cert.id}`}>Issue Date *</Label>
              <Input
                id={`date-${cert.id}`}
                type="month"
                value={cert.date}
                onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`credentialId-${cert.id}`}>Credential ID (Optional)</Label>
              <Input
                id={`credentialId-${cert.id}`}
                value={cert.credentialId}
                onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                placeholder="ABC123DEF456"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor={`verificationUrl-${cert.id}`}>Verification URL (Optional)</Label>
              <Input
                id={`verificationUrl-${cert.id}`}
                type="url"
                value={cert.verificationUrl}
                onChange={(e) => updateCertification(cert.id, 'verificationUrl', e.target.value)}
                placeholder="https://verify.example.com/cert/123"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
});
