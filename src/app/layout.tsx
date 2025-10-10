
'use client';

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { portfolioData } from '@/lib/data';
import { ActiveSectionContextProvider } from '@/contexts/active-section-context';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { cn } from '@/lib/utils';
import { Preloader } from '@/components/preloader';

// Note: Metadata is not used in a client component, but we keep it for potential future static rendering
// export const metadata: Metadata = {
//   title: portfolioData.name,
//   description: portfolioData.tagline,
//   icons: {
//     icon: portfolioData.favicon,
//   },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect runs only on the client
    const handleLoad = () => {
      // Add a small delay to ensure assets are fully rendered and avoid flicker
      setTimeout(() => setIsLoading(false), 300);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{portfolioData.name}</title>
        <meta name="description" content={portfolioData.tagline} />
        <link rel="icon" href={portfolioData.favicon} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn(
        "font-body antialiased",
        "bg-gradient-to-br from-background via-primary/5 to-background",
        "dark:from-background dark:via-primary/10 dark:to-background",
        "dark:bg-[length:200%_200%]",
        "dark:animate-gradient-flow"
      )}>
        <Preloader isLoading={isLoading} />
        <div className={cn('transition-opacity duration-500', isLoading ? 'opacity-0' : 'opacity-100')}>
          <ThemeProvider defaultTheme="system">
            <FirebaseClientProvider>
              <ActiveSectionContextProvider>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
                <Toaster />
              </ActiveSectionContextProvider>
            </FirebaseClientProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
