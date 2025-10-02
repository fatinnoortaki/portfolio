'use client';
import { useState, useTransition } from 'react';
import { generateProjectDescription } from '@/ai/flows/generate-project-description';
import type { Project } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

interface ProjectDialogProps {
  project?: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (project: Project) => void;
}

export function ProjectDialog({ project, open, onOpenChange, onSave }: ProjectDialogProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Project>>(project || {techStack: []});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateDescription = () => {
    startTransition(async () => {
      if (!formData.title || !formData.techStack) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please provide a project name and tech stack.' });
        return;
      }
      try {
        const { projectDescription } = await generateProjectDescription({
          projectName: formData.title,
          projectDetails: formData.description || '',
          techStack: formData.techStack.join(', '),
        });
        setFormData(prev => ({ ...prev, description: projectDescription }));
        toast({ title: 'Success', description: 'New project description generated!' });
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate description.' });
      }
    });
  };

  const handleSave = () => {
    // Basic validation
    if (!formData.title || !formData.description) {
      toast({ variant: 'destructive', title: 'Error', description: 'Title and description are required.' });
      return;
    }
    onSave(formData as Project);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Add Project'}</DialogTitle>
          <DialogDescription>Fill in the details of your project. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" name="title" value={formData.title || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">Description</Label>
            <div className="col-span-3 space-y-2">
              <Textarea id="description" name="description" value={formData.description || ''} onChange={handleInputChange} rows={4} />
              <div className="flex justify-end">
                <Button size="sm" onClick={handleGenerateDescription} disabled={isPending}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isPending ? 'Generating...' : 'Generate with AI'}
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="techStack" className="text-right">Tech Stack</Label>
            <Input id="techStack" name="techStack" placeholder="Comma-separated, e.g., Next.js, TypeScript" value={Array.isArray(formData.techStack) ? formData.techStack.join(', ') : ''} onChange={(e) => setFormData(prev => ({...prev, techStack: e.target.value.split(',').map(s => s.trim())}))} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" value={formData.imageUrl || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="liveUrl" className="text-right">Live URL</Label>
            <Input id="liveUrl" name="liveUrl" value={formData.liveUrl || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="repoUrl" className="text-right">Repo URL</Label>
            <Input id="repoUrl" name="repoUrl" value={formData.repoUrl || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
