
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

// A map to store the active ID for each observer root. This allows multiple
// independent scroll-spying components to coexist on the same page.
const activeIdStore = new Map<Element | Document | null, string>();

export function useScrollSpy(
  ids: string[],
  options: IntersectionObserverInit = {
    rootMargin: '0% 0% -40% 0%',
    threshold: 0.2,
  }
) {
  const [activeId, setActiveId] = useState('');
  const observer = useRef<IntersectionObserver | null>(null);

  const refs = useMemo(() => {
    const newRefs: { [key: string]: React.RefObject<HTMLDivElement> } = {};
    ids.forEach(id => {
      newRefs[id] = useRef<HTMLDivElement>(null);
    });
    return newRefs;
  }, [ids]);

  useEffect(() => {
    const root = options.root || null;
    if (observer.current) {
      observer.current.disconnect();
    }

    // Restore the active ID for this observer root, if it exists.
    if(root && activeIdStore.has(root)) {
        setActiveId(activeIdStore.get(root) || '');
    }

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry?.isIntersecting) {
          const newActiveId = entry.target.id;
          activeIdStore.set(root, newActiveId);
          setActiveId(newActiveId);
        }
      });
    };

    observer.current = new IntersectionObserver(handleObserver, options);
    const currentObserver = observer.current;

    Object.values(refs).forEach((ref) => {
        if (ref.current) {
            const id = ids.find(id => refs[id] === ref);
            if (id) {
                ref.current.id = id;
                currentObserver.observe(ref.current);
            }
        }
    });
    
    return () => {
      currentObserver.disconnect();
    };
  }, [ids, options, refs]);

  return { activeId, refs };
}
