"use client";

import { memo } from 'react';
import { Link2, Plus, Trash2, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LinkItem {
  id: string;
  platform: string;
  url: string;
}

interface LinksEditorProps {
  links: LinkItem[];
  onChange: (links: LinkItem[]) => void;
}

const platforms = [
  'LinkedIn',
  'GitHub',
  'Portfolio',
  'Twitter',
  'Medium',
  'Website',
  'Other'
];

export const LinksEditor = memo(function LinksEditor({ 
  links, 
  onChange 
}: LinksEditorProps) {
  const addLink = () => {
    const newLink: LinkItem = {
      id: Date.now().toString(),
      platform: 'LinkedIn',
      url: '',
    };
    onChange([...links, newLink]);
  };

  const updateLink = (id: string, field: keyof LinkItem, value: string) => {
    onChange(links.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  const removeLink = (id: string) => {
    onChange(links.filter(link => link.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Portfolio & Social Links</h3>
        </div>
        <Button onClick={addLink} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      </div>

      {links.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No links added yet</p>
          <Button onClick={addLink} variant="outline" className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Link
          </Button>
        </Card>
      )}

      {links.map((link, idx) => (
        <Card key={link.id} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
              <span className="text-sm font-medium text-muted-foreground">
                Link #{idx + 1}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => removeLink(link.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`platform-${link.id}`}>Platform *</Label>
              <Select
                value={link.platform}
                onValueChange={(value) => updateLink(link.id, 'platform', value)}
              >
                <SelectTrigger id={`platform-${link.id}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map(platform => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor={`url-${link.id}`}>URL *</Label>
              <Input
                id={`url-${link.id}`}
                type="url"
                value={link.url}
                onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                required
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
});
