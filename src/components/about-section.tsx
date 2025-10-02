'use client';

import Image from 'next/image';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { FunFact } from '@/lib/definitions';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Microscope, Leaf, Bot, BarChart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  "🔬": Microscope,
  "🌱": Leaf,
  "🤖": Bot,
  "📈": BarChart,
};

type AboutData = {
  bio: string;
  photoUrl: string;
  funFacts: FunFact[];
};

export function AboutSection() {
  const firestore = useFirestore();
  const aboutRef = useMemoFirebase(() => firestore ? doc(firestore, 'about', 'main') : null, [firestore]);
  const { data: aboutData, isLoading } = useDoc<AboutData>(aboutRef);

  if (isLoading) {
    return (
      <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="flex items-center justify-center">
              <Skeleton className="relative w-64 h-64 md:w-80 md:h-80 rounded-full" />
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <Skeleton className="h-12 w-48" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <div className="space-y-4 pt-4">
                <Skeleton className="h-8 w-40" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!aboutData) {
    return (
      <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6 text-center">
          <p>About information could not be loaded.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex items-center justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <Image
                src={aboutData.photoUrl}
                alt="Profile Photo"
                width={400}
                height={400}
                className="rounded-full object-cover border-4 border-background shadow-lg"
                data-ai-hint="profile photo"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
                About Me
              </h2>
              <p className="max-w-[600px] text-foreground/80 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                {aboutData.bio}
              </p>
            </div>
            <div className="space-y-4 pt-4">
                <h3 className="text-xl font-bold font-headline">A Few Fun Facts</h3>
                <div className="grid grid-cols-2 gap-4">
                    {aboutData.funFacts.map((fact, index) => {
                      const Icon = iconMap[fact.icon] || Leaf;
                      return (
                        <Card key={index} className="bg-background/70">
                            <CardContent className="p-4 flex items-center gap-4">
                                <Icon className="h-6 w-6 text-primary" />
                                <p className="text-sm text-foreground/90">{fact.text}</p>
                            </CardContent>
                        </Card>
                      )
                    })}
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
