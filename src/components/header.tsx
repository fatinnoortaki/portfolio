import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';
import { portfolioData } from '@/lib/data';

const navLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#resume', label: 'Resume' },
  { href: '#socials', label: 'Connect' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src={portfolioData.logo} alt="Logo" width={24} height={24} className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block font-headline">{portfolioData.name}</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Placeholder for potential mobile nav trigger */}

        <div className="flex items-center justify-end space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
