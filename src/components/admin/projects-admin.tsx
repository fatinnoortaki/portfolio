'use client';

import { useState, useTransition, useEffect } from 'react';
import Image from 'next/image';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { saveProjectsClient } from '@/lib/client-actions';
import type { Project } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, MoreHorizontal, Trash, Edit, Save } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ProjectDialog } from './project-dialog';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

export function ProjectsAdmin() {
  const firestore = useFirestore();
  const projectsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'projects') : null, [firestore]);
  const { data: initialProjects, isLoading: isLoadingProjects } = useCollection<Project>(projectsQuery);

  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSaving, startSavingTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (initialProjects) {
      setProjects(initialProjects);
    }
  }, [initialProjects]);

  const handleAddNew = () => {
    setSelectedProject(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };
  
  const handleSaveDialog = (project: Project) => {
    if (project.id) {
      setProjects(projects.map(p => p.id === project.id ? project : p));
    } else {
      const newProject: Project = { 
        ...project, 
        id: `proj-${Date.now()}`,
        imageUrl: project.imageUrl || "https://picsum.photos/seed/new-project/600/400",
        imageHint: project.imageHint || "new project",
      };
      setProjects([...projects, newProject]);
    }
  };

  const handleSaveAll = () => {
    startSavingTransition(async () => {
      try {
        await saveProjectsClient(firestore, projects);
        toast({ title: 'Success!', description: 'Projects saved successfully.' });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to save projects.';
        toast({ variant: 'destructive', title: 'Error', description: message });
      }
    });
  };

  if (isLoadingProjects) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </CardContent>
        </Card>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div/>
        <div className="flex items-center gap-2">
           <Button size="sm" variant="outline" onClick={handleAddNew}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Project
          </Button>
          <Button size="sm" onClick={handleSaveAll} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Manage your portfolio projects. Add, edit, or delete projects.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">{project.description}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(project)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(project.id)}>
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                   <Image
                    src={project.imageUrl || "https://picsum.photos/seed/placeholder/600/400"}
                    alt={project.title || "Project image"}
                    width={300}
                    height={200}
                    className="rounded-md object-cover w-full aspect-[3/2]"
                    data-ai-hint={project.imageHint}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      <ProjectDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        project={selectedProject} 
        onSave={handleSaveDialog}
      />
    </>
  );
}
