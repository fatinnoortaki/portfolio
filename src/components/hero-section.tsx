import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { portfolioData } from '@/lib/data';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/definitions';

export function HeroSection() {
  const featuredProjects = portfolioData.projects.filter(p => p.featured);

  return (
    <section id="hero" className="w-full py-20 md:py-24 lg:py-32 border-b">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-12">
          <div className="flex flex-col justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline text-primary/90">
                {portfolioData.name}
              </h1>
              <p className="max-w-[700px] mx-auto text-foreground/80 md:text-xl">
                {portfolioData.tagline}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="#contact">
                  Get in Touch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
               <Button asChild size="lg" variant="outline">
                <Link href="#portfolio">
                  View My Work
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="w-full max-w-5xl">
            <h3 className="text-2xl font-bold tracking-tight text-center mb-6 font-headline">Featured Projects</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {featuredProjects.map((project: Project) => (
                <Card key={project.id} className="group overflow-hidden">
                  <Link href={project.liveUrl || '#'} target="_blank" rel="noopener noreferrer">
                    <div className="relative h-48">
                       <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint={project.imageHint}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                        <div className="absolute top-4 right-4">
                          <ExternalLink className="h-5 w-5 text-white/80 group-hover:text-white" />
                        </div>
                    </div>
                    <CardHeader>
                      <h4 className="font-headline text-lg font-semibold">{project.title}</h4>
                      <div className="flex flex-wrap gap-2 pt-2">
                          {project.techStack.slice(0, 3).map((tech) => (
                              <Badge key={tech} variant="secondary">{tech}</Badge>
                          ))}
                      </div>
                    </CardHeader>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
