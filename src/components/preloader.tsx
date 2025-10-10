
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
        'fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500',
        isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <div className="animate-pulse">
        <Image src={portfolioData.logo} alt="Logo" width={48} height={48} className="h-12 w-12" />
      </div>
    </div>
  );
}
