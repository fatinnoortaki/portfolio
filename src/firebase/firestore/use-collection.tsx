
'use client';

import { useEffect, useState, useRef } from 'react';
import { onSnapshot, Query, DocumentData, SnapshotOptions } from 'firebase/firestore';
import { useError } from '../error-handler-provider';

type UseCollectionState<T> = {
  data: T[] | null;
  loading: boolean;
};

const getDocWithId = <T>(doc: DocumentData, id: string): T => {
    return { ...doc.data(), id } as T;
};


export function useCollection<T>(query: Query | null, options?: SnapshotOptions) {
  const { setError } = useError();
  const [collection, setCollection] = useState<UseCollectionState<T>>({ data: null, loading: true });
  const queryRef = useRef(query);

  useEffect(() => {
    if (!query) {
      setCollection({ data: [], loading: false });
      return;
    }

    // Deep compare query to avoid re-running effect
    if (JSON.stringify(queryRef.current) === JSON.stringify(query)) {
      return;
    }
    queryRef.current = query;


    const unsubscribe = onSnapshot(query, (snapshot) => {
      const data = snapshot.docs.map((doc) => getDocWithId<T>(doc, doc.id));
      setCollection({ data, loading: false });
    },
    (error) => {
        setError(error);
        setCollection({ data: [], loading: false });
    });

    return () => unsubscribe();
  }, [query, options, setError]);

  return collection;
}
