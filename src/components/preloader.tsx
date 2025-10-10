
'use client';

import Image from 'next/image';
import { portfolioData } from '@/lib/data';
import { cn } from '@/lib/utils';

type PreloaderProps = {
  isLoading: boolean;
};

export function Preloader({ isLoading }: PreloaderProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-background duration-500',
        isLoading ? 'animate-fade-in' : 'animate-slide-out-up pointer-events-none'
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="animate-pulse">
          <Image src={portfolioData.logo} alt="Logo" width={48} height={48} className="h-12 w-12" />
        </div>
        <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="w-full h-full bg-primary animate-loading-bar rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
