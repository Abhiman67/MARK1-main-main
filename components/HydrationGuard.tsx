"use client";

import { useEffect, useState, ReactNode } from 'react';

/**
 * HydrationGuard: Prevents hydration mismatches by ensuring client-side rendering
 * only happens after component mounts. Useful for theme-dependent UI or dynamic content.
 */
export function HydrationGuard({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
}
