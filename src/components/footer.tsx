import Link from 'next/link';
import { portfolioData } from '@/lib/data';
import { Icons } from './icons';
import { Button } from './ui/button';
import { LogIn } from 'lucide-react';

export function Footer() {
  const socialIconMap = {
    GitHub: Icons.gitHub,
    LinkedIn: Icons.linkedIn,
    Twitter: Icons.twitter,
  };

  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">
            Built by {portfolioData.name}. © {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {portfolioData.socialLinks.map((social) => {
            const Icon = socialIconMap[social.name];
            return (
              <Button key={social.name} variant="ghost" size="icon" asChild>
                <Link href={social.url} target="_blank" rel="noopener noreferrer">
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              </Button>
            );
          })}
           <Button asChild variant="outline" size="sm">
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Admin Login
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
