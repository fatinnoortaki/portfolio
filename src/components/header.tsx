import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { portfolioData } from '@/lib/data';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#resume', label: 'Resume' },
  { href: '#contact', label: 'Contact' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="/media/favicon.png" alt="Logo" width={24} height={24} className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block font-headline">{portfolioData.name}</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/60 transition-colors hover:text-foreground/80"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                  <Image src="/media/favicon.png" alt="Logo" width={24} height={24} className="h-6 w-6" />
                  <span className="font-bold sm:inline-block font-headline">{portfolioData.name}</span>
                </Link>
                <div className="my-4 h-px w-full bg-border" />
                <div className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="secondary" size="sm">
              <Link href="/login">Admin Login</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
