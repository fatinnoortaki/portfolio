
'use client';

import type { MouseEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { portfolioData } from '@/lib/data';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/definitions';
import { Typewriter } from './typewriter';
import { QuoteSection } from './quote-section';
import { cn } from '@/lib/utils';

export function HeroSection() {
  const featuredProjects = portfolioData.projects.filter(p => p.featured);

  const handleScroll = (e: MouseEvent<HTMLButtonElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      className="w-full border-b flex items-center min-h-screen py-20 md:py-24 lg:py-32"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-12">
          <div className="flex flex-col justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline text-primary/90 mb-4">
                {portfolioData.name}
              </h1>
              <p className="max-w-[700px] mx-auto text-foreground/80 md:text-xl">
                <Typewriter text={portfolioData.tagline} className="max-w-[700px] mx-auto text-foreground/80 md:text-xl" />
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" onClick={(e) => handleScroll(e, '#socials')}>
                  Get in Touch
                  <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
               <Button size="lg" variant="outline" onClick={(e) => handleScroll(e, '#portfolio')}>
                  View My Work
              </Button>
            </div>
          </div>
          
          <QuoteSection />

        </div>
      </div>
    </section>
  );
}
