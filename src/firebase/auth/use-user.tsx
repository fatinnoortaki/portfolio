'use client';

import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { useAuth } from '@/firebase/provider';
import { useError } from '@/firebase/error-handler-provider';

type UseUserState = {
  data: User | null;
  loading: boolean;
};

export function useUser() {
  const auth = useAuth();
  const { setError } = useError();
  const [user, setUser] = useState<UseUserState>({ data: null, loading: true });

  useEffect(() => {
    if (!auth) {
      setUser({ data: null, loading: false });
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser({ data: user, loading: false });
      },
      (error) => {
        setError(error);
        setUser({ data: null, loading: false });
      }
    );

    return () => unsubscribe();
  }, [auth, setError]);

  return user;
}
