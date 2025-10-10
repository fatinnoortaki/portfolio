
'use client';

import { useEffect, useState, useRef } from 'react';
import { onSnapshot, DocumentReference, DocumentData, SnapshotOptions } from 'firebase/firestore';
import { useError } from '../error-handler-provider';

type UseDocState<T> = {
  data: T | null;
  loading: boolean;
};

const getDocWithId = <T>(doc: DocumentData, id: string): T => {
    return { ...doc.data(), id } as T;
};

export function useDoc<T>(ref: DocumentReference | null, options?: SnapshotOptions) {
  const { setError } = useError();
  const [doc, setDoc] = useState<UseDocState<T>>({ data: null, loading: true });
  const refRef = useRef(ref);

  useEffect(() => {
    if (!ref) {
      setDoc({ data: null, loading: false });
      return;
    }

    if (JSON.stringify(refRef.current) === JSON.stringify(ref)) {
      return;
    }
    refRef.current = ref;

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) {
        const data = getDocWithId<T>(snapshot, snapshot.id);
        setDoc({ data, loading: false });
      } else {
        setDoc({ data: null, loading: false });
      }
    },
    (error) => {
        setError(error);
        setDoc({ data: null, loading: false });
    });

    return () => unsubscribe();
  }, [ref, options, setError]);

  return doc;
}
