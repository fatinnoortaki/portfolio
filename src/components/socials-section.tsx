import { portfolioData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Icons } from './icons';

export function SocialsSection() {
    const socialIconMap = {
        GitHub: Icons.gitHub,
        LinkedIn: Icons.linkedIn,
        Twitter: Icons.twitter,
        Telegram: Icons.telegram,
        WhatsApp: Icons.whatsApp,
        Email: Icons.email,
        Facebook: Icons.facebook,
        Instagram: Icons.instagram,
      };

  return (
    <section id="socials" className="w-full py-12 md:py-24 lg:py-32 border-t">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Connect With Me</h2>
            <p className="mx-auto max-w-[600px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              I'm always open to connecting with new people. Feel free to reach out on any of these platforms!
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {portfolioData.connectLinks.map((social) => {
              const Icon = socialIconMap[social.name as keyof typeof socialIconMap];
              return (
                <Button key={social.name} variant="outline" size="lg" asChild>
                  <Link href={social.url} target="_blank" rel="noopener noreferrer">
                    <Icon className="h-6 w-6" />
                    <span>{social.name}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
