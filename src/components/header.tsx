
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';
import { portfolioData } from '@/lib/data';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useActiveSection } from '@/hooks/use-scroll-spy';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#resume', label: 'Resume' },
  { href: '#socials', label: 'Connect' },
];

export function Header() {
  const activeId = useActiveSection();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={portfolioData.logo} alt="Logo" width={24} height={24} className="h-6 w-6" />
            <span className="font-bold font-headline">{portfolioData.name}</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-8 text-sm flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                link.href === `#${activeId}` ? "text-foreground" : "text-foreground/60"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center justify-end space-x-2">
          <div className="hidden items-center justify-end space-x-2 md:flex">
              <ThemeToggle />
          </div>
          <div className="md:hidden">
              <Sheet>
                  <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                          <Menu className="h-5 w-5" />
                          <span className="sr-only">Toggle Menu</span>
                      </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="pr-0 flex flex-col">
                      <SheetHeader className="p-6 pb-0 sr-only">
                          <SheetTitle>Mobile Navigation</SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-col gap-4 p-6 flex-1">
                      {navLinks.map((link) => (
                          <Link
                              key={link.href}
                              href={link.href}
                              className={cn(
                                "transition-colors hover:text-foreground/80 text-lg",
                                link.href === `#${activeId}` ? "text-foreground" : "text-foreground/60"
                              )}
                          >
                              {link.label}
                          </Link>
                          ))}
                      </div>
                      <div className="my-4 h-px w-full bg-border" />
                      <div className="p-6 pt-0">
                          <ThemeToggle />
                      </div>
                  </SheetContent>
              </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
