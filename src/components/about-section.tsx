import Image from 'next/image';
import { portfolioData } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';

export function AboutSection() {
  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex items-center justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <Image
                src={portfolioData.profilePhotoUrl}
                alt="Profile Photo"
                width={400}
                height={400}
                className="rounded-full object-cover border-4 border-background shadow-lg"
                data-ai-hint={portfolioData.profilePhotoHint}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
                About Me
              </h2>
              <p className="max-w-[600px] text-foreground/80 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                {portfolioData.bio}
              </p>
            </div>
            <div className="space-y-4 pt-4">
                <h3 className="text-xl font-bold font-headline">A Few Fun Facts</h3>
                <div className="grid grid-cols-2 gap-4">
                    {portfolioData.funFacts.map((fact) => (
                        <Card key={fact.text} className="bg-background/70">
                            <CardContent className="p-4 flex items-center gap-4">
                                <span className="text-2xl">{fact.icon}</span>
                                <p className="text-sm text-foreground/90">{fact.text}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
