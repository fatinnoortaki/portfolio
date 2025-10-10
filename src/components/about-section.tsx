
import Image from 'next/image';
import { portfolioData } from '@/lib/data';
import type { FunFact } from '@/lib/definitions';
import { Card, CardContent } from '@/components/ui/card';
import { Microscope, Leaf, Bot, BarChart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  "🔬": Microscope,
  "🌱": Leaf,
  "🤖": Bot,
  "📈": BarChart,
};

export function AboutSection() {
  const { bio, profilePhotoUrl, profilePhotoHint, funFacts } = portfolioData;

  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="grid items-center justify-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex justify-center">
            <Image
              src={profilePhotoUrl}
              alt="Profile Photo"
              width={320}
              height={320}
              className="rounded-full object-cover border-4 border-background shadow-lg h-64 w-64 md:h-80 md:w-80"
              data-ai-hint={profilePhotoHint}
            />
          </div>
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-center lg:text-left">
                About Me
              </h2>
              <p className="max-w-[600px] text-foreground/80 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed mx-auto lg:mx-0">
                {bio}
              </p>
            </div>
            <div className="space-y-4">
                <h3 className="text-xl font-bold font-headline text-center lg:text-left">A Few Fun Facts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {funFacts.map((fact: FunFact, index: number) => {
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
