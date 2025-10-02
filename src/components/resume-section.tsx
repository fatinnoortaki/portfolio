'use client';

import Link from 'next/link';
import { portfolioData } from '@/lib/data';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Experience, Education } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Briefcase, GraduationCap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function ResumeSection() {
  const firestore = useFirestore();

  const expQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'resumeEntries'), where('type', '==', 'experience')) : null, [firestore]);
  const eduQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'resumeEntries'), where('type', '==', 'education')) : null, [firestore]);

  const { data: experiences, isLoading: isLoadingExp } = useCollection<Experience>(expQuery);
  const { data: educations, isLoading: isLoadingEdu } = useCollection<Education>(eduQuery);
  
  const isLoading = isLoadingExp || isLoadingEdu;

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
          <Button asChild>
            <Link href={portfolioData.cvUrl} target="_blank">
              <Download className="mr-2 h-4 w-4" />
              Download CV
            </Link>
          </Button>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 mt-12">
          <div className="grid gap-6">
            <div className="flex items-center gap-4">
              <Briefcase className="h-8 w-8 text-primary" />
              <h3 className="text-2xl font-bold font-headline">Experience</h3>
            </div>
            <div className="grid gap-4">
              {isLoading ? (
                <>
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </>
              ) : (
                experiences?.map((exp) => (
                  <Card key={exp.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{exp.role}</CardTitle>
                      <p className="text-sm text-muted-foreground">{exp.company} • {exp.period}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground/80">{exp.description}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
          <div className="grid gap-6">
            <div className="flex items-center gap-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h3 className="text-2xl font-bold font-headline">Education</h3>
            </div>
            <div className="grid gap-4">
               {isLoading ? (
                <>
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </>
              ) : (
                educations?.map((edu) => (
                  <Card key={edu.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{edu.degree}</CardTitle>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground/80">{edu.period}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
