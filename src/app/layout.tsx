import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { portfolioData } from '@/lib/data';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Home, User, Briefcase, Star, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: portfolioData.name,
  description: portfolioData.tagline,
  icons: {
    icon: portfolioData.favicon,
  },
};

const navLinks = [
  { href: '#hero', label: 'Home', icon: Home },
  { href: '#about', label: 'About', icon: User },
  { href: '#portfolio', label: 'Portfolio', icon: Star },
  { href: '#resume', label: 'Resume', icon: Briefcase },
  { href: '#socials', label: 'Connect', icon: Phone },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider defaultTheme="system">
          <SidebarProvider>
            <Sidebar>
              <SidebarHeader>
                <Link href="/" className="mr-6 flex items-center space-x-2">
                  <Image src={portfolioData.logo} alt="Logo" width={24} height={24} className="h-6 w-6" />
                  <span className="font-bold sm:inline-block font-headline">{portfolioData.name}</span>
                </Link>
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  {navLinks.map((link) => (
                    <SidebarMenuItem key={link.href}>
                       <Link href={link.href} className="w-full">
                        <SidebarMenuButton className="w-full justify-start" tooltip={link.label}>
                          <link.icon className="h-5 w-5" />
                          <span>{link.label}</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>

            <SidebarInset>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </SidebarInset>
            
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
