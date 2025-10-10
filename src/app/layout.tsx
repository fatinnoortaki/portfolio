
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

export const metadata: Metadata = {
  title: portfolioData.name,
  description: portfolioData.tagline,
  icons: {
    icon: portfolioData.favicon,
  },
};

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
      <body className={cn(
        "font-body antialiased",
        "bg-gradient-to-br from-background via-primary/5 to-background",
        "dark:from-background dark:via-primary/10 dark:to-background",
        "bg-[length:200%_200%]",
        "dark:animate-gradient-flow"
      )}>
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
      </body>
    </html>
  );
}
