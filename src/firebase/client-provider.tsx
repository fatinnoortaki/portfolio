'use client';

import { ReactNode, useMemo } from 'react';
import { initializeFirebase, FirebaseProvider } from '@/firebase';
import { ErrorHandlerProvider } from './error-handler-provider';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const firebaseContext = useMemo(() => initializeFirebase(), []);

  return (
    <ErrorHandlerProvider>
        <FirebaseProvider {...firebaseContext}>
            {children}
        </FirebaseProvider>
    </ErrorHandlerProvider>
  );
}
