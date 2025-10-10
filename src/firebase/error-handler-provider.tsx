'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type ErrorContextType = {
  error: Error | null;
  setError: (error: Error | null) => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorHandlerProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<Error | null>(null);

  // In a real app, you might want to log this error to a service
  if (error) {
    console.error("Caught Firebase Error:", error);
  }

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorHandlerProvider');
  }
  return context;
}
