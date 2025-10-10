
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { portfolioData } from '@/lib/data';
import type { Project } from '@/lib/definitions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Github } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PortfolioSection() {
  const { projects } = portfolioData;

  // Create a unique list of all tech stacks for filter buttons
  const allTechs = Array.from(new Set(projects.flatMap(p => p.techStack)));
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.techStack.includes(activeFilter));

  return (
    <section id="portfolio" className="w-full py-12 md:py-24 lg:py-32 section-hidden">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">My Work</h2>
            <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Here are some of the projects I'm proud to have worked on. Each one represents a challenge I was excited to tackle.
            </p>
          </div>
        </div>
        
        <div className="flex justify-center flex-wrap gap-2 mt-8 mb-12">
            <Button
                variant={activeFilter === 'All' ? 'default' : 'outline'}
                onClick={() => setActiveFilter('All')}
            >
                All
            </Button>
            {allTechs.map(tech => (
                <Button
                    key={tech}
                    variant={activeFilter === tech ? 'default' : 'outline'}
                    onClick={() => setActiveFilter(tech)}
                >
                    {tech}
                </Button>
            ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {filteredProjects.map((project: Project) => (
            <Card key={project.id} className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                    data-ai-hint={project.imageHint}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-1">
                <CardTitle className="font-headline text-xl mb-2">{project.title}</CardTitle>
                <CardDescription className="mb-4">{project.description}</CardDescription>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className={cn("font-normal", activeFilter === tech && "bg-primary/20 text-primary-foreground")}>{tech}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-end gap-2">
                {project.liveUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={project.liveUrl} target="_blank">
                      <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                    </Link>
                  </Button>
                )}
                {project.repoUrl && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={project.repoUrl} target="_blank">
                      <Github className="mr-2 h-4 w-4" /> Source Code
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
