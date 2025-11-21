"use client";

import { memo } from 'react';
import { FileCode2, Plus, Trash2, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  highlights: string[];
  startDate?: string;
  endDate?: string;
  url?: string;
}

interface ProjectsEditorProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

export const ProjectsEditor = memo(function ProjectsEditor({ 
  projects, 
  onChange 
}: ProjectsEditorProps) {
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      highlights: [''],
      startDate: '',
      endDate: '',
      url: '',
    };
    onChange([...projects, newProject]);
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    onChange(projects.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    ));
  };

  const removeProject = (id: string) => {
    onChange(projects.filter(proj => proj.id !== id));
  };

  const addTechnology = (projId: string, tech: string) => {
    const trimmed = tech.trim();
    if (!trimmed) return;
    
    onChange(projects.map(proj => {
      if (proj.id === projId && !proj.technologies.includes(trimmed)) {
        return { ...proj, technologies: [...proj.technologies, trimmed] };
      }
      return proj;
    }));
  };

  const removeTechnology = (projId: string, tech: string) => {
    onChange(projects.map(proj => 
      proj.id === projId 
        ? { ...proj, technologies: proj.technologies.filter(t => t !== tech) }
        : proj
    ));
  };

  const addHighlight = (projId: string) => {
    onChange(projects.map(proj => 
      proj.id === projId ? { ...proj, highlights: [...proj.highlights, ''] } : proj
    ));
  };

  const updateHighlight = (projId: string, index: number, value: string) => {
    onChange(projects.map(proj => {
      if (proj.id === projId) {
        const newHighlights = [...proj.highlights];
        newHighlights[index] = value;
        return { ...proj, highlights: newHighlights };
      }
      return proj;
    }));
  };

  const removeHighlight = (projId: string, index: number) => {
    onChange(projects.map(proj => {
      if (proj.id === projId) {
        return { ...proj, highlights: proj.highlights.filter((_, i) => i !== index) };
      }
      return proj;
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Projects</h3>
        </div>
        <Button onClick={addProject} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No projects added yet</p>
          <Button onClick={addProject} variant="outline" className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Project
          </Button>
        </Card>
      )}

      {projects.map((proj, idx) => (
        <Card key={proj.id} className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
              <span className="text-sm font-medium text-muted-foreground">
                Project #{idx + 1}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => removeProject(proj.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`name-${proj.id}`}>Project Name *</Label>
              <Input
                id={`name-${proj.id}`}
                value={proj.name}
                onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                placeholder="E-commerce Platform"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`description-${proj.id}`}>Description *</Label>
              <Textarea
                id={`description-${proj.id}`}
                value={proj.description}
                onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                placeholder="A full-stack e-commerce platform with..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`url-${proj.id}`}>Project URL (Optional)</Label>
              <Input
                id={`url-${proj.id}`}
                type="url"
                value={proj.url}
                onChange={(e) => updateProject(proj.id, 'url', e.target.value)}
                placeholder="https://github.com/username/project"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`startDate-${proj.id}`}>Start Date</Label>
                <Input
                  id={`startDate-${proj.id}`}
                  type="month"
                  value={proj.startDate}
                  onChange={(e) => updateProject(proj.id, 'startDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`endDate-${proj.id}`}>End Date</Label>
                <Input
                  id={`endDate-${proj.id}`}
                  type="month"
                  value={proj.endDate}
                  onChange={(e) => updateProject(proj.id, 'endDate', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Technologies Used</Label>
              <div className="flex gap-2">
                <Input
                  id={`tech-input-${proj.id}`}
                  placeholder="Add technologies (comma-separated: React, Node.js, MongoDB)"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    const input = document.getElementById(`tech-input-${proj.id}`) as HTMLInputElement;
                    if (input && input.value.trim()) {
                      input.value.split(',').forEach(tech => {
                        const trimmed = tech.trim();
                        if (trimmed) addTechnology(proj.id, trimmed);
                      });
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              {proj.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {proj.technologies.map((tech, techIdx) => (
                    <Badge key={techIdx} variant="secondary">
                      {tech}
                      <button
                        onClick={() => removeTechnology(proj.id, tech)}
                        className="ml-2 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Key Highlights</Label>
                <Button 
                  onClick={() => addHighlight(proj.id)} 
                  variant="outline" 
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Highlight
                </Button>
              </div>

              {proj.highlights.map((highlight, hlIdx) => (
                <div key={hlIdx} className="flex gap-2">
                  <Textarea
                    value={highlight}
                    onChange={(e) => updateHighlight(proj.id, hlIdx, e.target.value)}
                    placeholder="Implemented real-time chat feature..."
                    rows={2}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHighlight(proj.id, hlIdx)}
                    disabled={proj.highlights.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
});
