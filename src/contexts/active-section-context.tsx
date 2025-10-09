
'use client';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useState } from 'react';

type ActiveSectionContextType = {
  activeId: string;
  setActiveId: Dispatch<SetStateAction<string>>;
};

export const ActiveSectionContext = createContext<ActiveSectionContextType | null>(null);

export function ActiveSectionContextProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState('');

  return (
    <ActiveSectionContext.Provider value={{ activeId, setActiveId }}>
      {children}
    </ActiveSectionContext.Provider>
  );
}

export function useActiveSectionContext() {
    const context = useContext(ActiveSectionContext);
    if (context === null) {
        throw new Error(
            'useActiveSectionContext must be used within an ActiveSectionContextProvider'
        );
    }
    return context;
}
