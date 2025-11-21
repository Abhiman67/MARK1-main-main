"use client";

import { useState } from 'react';
import { Palette, Type, Maximize2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface ThemeCustomization {
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  sectionSpacing: number;
  margins: number;
}

const DEFAULT_THEME: ThemeCustomization = {
  primaryColor: '#3B82F6',
  accentColor: '#8B5CF6',
  fontFamily: 'Inter',
  fontSize: 14,
  lineHeight: 1.6,
  sectionSpacing: 24,
  margins: 48,
};

const PRESET_COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F59E0B' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Gray', value: '#6B7280' },
  { name: 'Black', value: '#000000' },
];

const FONT_FAMILIES = [
  { name: 'Inter (Modern)', value: 'Inter' },
  { name: 'Georgia (Classic)', value: 'Georgia' },
  { name: 'Roboto (Clean)', value: 'Roboto' },
  { name: 'Merriweather (Elegant)', value: 'Merriweather' },
  { name: 'Lato (Professional)', value: 'Lato' },
];

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeCustomization;
  onChange: (theme: ThemeCustomization) => void;
}

export function ThemeCustomizer({ isOpen, onClose, theme, onChange }: ThemeCustomizerProps) {
  const [localTheme, setLocalTheme] = useState<ThemeCustomization>(theme);

  const handleApply = () => {
    onChange(localTheme);
    onClose();
  };

  const handleReset = () => {
    setLocalTheme(DEFAULT_THEME);
    onChange(DEFAULT_THEME);
  };

  const updateTheme = (key: keyof ThemeCustomization, value: any) => {
    setLocalTheme(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Customization
          </DialogTitle>
          <DialogDescription>
            Personalize colors, fonts, and spacing for your resume template
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="colors" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="colors">
              <Palette className="h-4 w-4 mr-2" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography">
              <Type className="h-4 w-4 mr-2" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="spacing">
              <Maximize2 className="h-4 w-4 mr-2" />
              Spacing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-6 mt-6">
            <div>
              <Label className="mb-3 block">Primary Color</Label>
              <div className="grid grid-cols-8 gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => updateTheme('primaryColor', color.value)}
                    className={`h-12 w-12 rounded-lg transition-all ${
                      localTheme.primaryColor === color.value
                        ? 'ring-2 ring-offset-2 ring-primary scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    aria-label={color.name}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Input
                  type="color"
                  value={localTheme.primaryColor}
                  onChange={(e) => updateTheme('primaryColor', e.target.value)}
                  className="w-20 h-10"
                />
                <span className="text-sm text-muted-foreground font-mono">
                  {localTheme.primaryColor}
                </span>
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Accent Color</Label>
              <div className="grid grid-cols-8 gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => updateTheme('accentColor', color.value)}
                    className={`h-12 w-12 rounded-lg transition-all ${
                      localTheme.accentColor === color.value
                        ? 'ring-2 ring-offset-2 ring-primary scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    aria-label={color.name}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Input
                  type="color"
                  value={localTheme.accentColor}
                  onChange={(e) => updateTheme('accentColor', e.target.value)}
                  className="w-20 h-10"
                />
                <span className="text-sm text-muted-foreground font-mono">
                  {localTheme.accentColor}
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-6 mt-6">
            <div>
              <Label className="mb-3 block">Font Family</Label>
              <div className="grid grid-cols-2 gap-2">
                {FONT_FAMILIES.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => updateTheme('fontFamily', font.value)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      localTheme.fontFamily === font.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ fontFamily: font.value }}
                  >
                    <span className="font-medium">{font.name}</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      The quick brown fox jumps over the lazy dog
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-3 block">
                Font Size: {localTheme.fontSize}px
              </Label>
              <Slider
                value={[localTheme.fontSize]}
                onValueChange={([value]) => updateTheme('fontSize', value)}
                min={10}
                max={18}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <Label className="mb-3 block">
                Line Height: {localTheme.lineHeight}
              </Label>
              <Slider
                value={[localTheme.lineHeight]}
                onValueChange={([value]) => updateTheme('lineHeight', value)}
                min={1.2}
                max={2.0}
                step={0.1}
                className="w-full"
              />
            </div>
          </TabsContent>

          <TabsContent value="spacing" className="space-y-6 mt-6">
            <div>
              <Label className="mb-3 block">
                Section Spacing: {localTheme.sectionSpacing}px
              </Label>
              <Slider
                value={[localTheme.sectionSpacing]}
                onValueChange={([value]) => updateTheme('sectionSpacing', value)}
                min={12}
                max={48}
                step={4}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Space between resume sections
              </p>
            </div>

            <div>
              <Label className="mb-3 block">
                Page Margins: {localTheme.margins}px
              </Label>
              <Slider
                value={[localTheme.margins]}
                onValueChange={([value]) => updateTheme('margins', value)}
                min={24}
                max={72}
                step={8}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">
                White space around the page edges
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            Reset to Default
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Apply Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper component
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`border rounded px-3 py-2 ${props.className || ''}`}
    />
  );
}
