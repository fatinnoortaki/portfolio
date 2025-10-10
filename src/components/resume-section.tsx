
'use client';

import Link from 'next/link';
import { portfolioData } from '@/lib/data';
import type { Experience, Education } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Briefcase, GraduationCap } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useIsMobile } from '@/hooks/use-mobile';


export function ResumeSection() {
  const { experiences, educations, cvUrl } = portfolioData;
  const isMobile = useIsMobile();

  const cvEmbedUrl = cvUrl.replace('/view?usp=sharing', '/preview');

  return (
    <section id="resume" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">My Journey</h2>
            <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              A brief overview of my professional and educational background. For more details, feel free to download my CV.
            </p>
          </div>
          
          {isMobile ? (
             <Button asChild>
                <Link href={cvUrl} target="_blank">
                  <Download className="mr-2 h-4 w-4" />
                  View CV
                </Link>
              </Button>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  View CV
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl h-screen flex flex-col p-0">
                <DialogHeader className="p-4 border-b">
                  <DialogTitle>My Curriculum Vitae</DialogTitle>
                </DialogHeader>
                <div className="flex-1">
                  <iframe 
                    src={cvEmbedUrl}
                    className="w-full h-full border-0"
                    allow="autoplay"
                  ></iframe>
                </div>
              </DialogContent>
            </Dialog>
          )}

        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 mt-12">
          <div className="grid gap-6">
            <div className="flex items-center gap-4">
              <Briefcase className="h-8 w-8 text-primary" />
              <h3 className="text-2xl font-bold font-headline">Experience</h3>
            </div>
            <div className="grid gap-4">
              {experiences.map((exp: Experience) => (
                <Card key={exp.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{exp.role}</CardTitle>
                    <p className="text-sm text-muted-foreground">{exp.company} • {exp.period}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/80">{exp.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="grid gap-6">
            <div className="flex items-center gap-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h3 className="text-2xl font-bold font-headline">Education</h3>
            </div>
            <div className="grid gap-4">
              {educations.map((edu: Education) => (
                <Card key={edu.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{edu.degree}</CardTitle>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/80">{edu.period}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
