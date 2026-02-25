'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SCROLL_RESTORE_KEY = 'felixaverlant-home-scroll';

function restoreScrollIfSaved() {
  if (typeof window === 'undefined') return;
  try {
    const saved = sessionStorage.getItem(SCROLL_RESTORE_KEY);
    if (saved === null) return;

    const y = parseInt(saved, 10);
    if (Number.isNaN(y) || y <= 0) {
      sessionStorage.removeItem(SCROLL_RESTORE_KEY);
      return;
    }

    sessionStorage.removeItem(SCROLL_RESTORE_KEY);
    requestAnimationFrame(() => {
      window.scrollTo({ top: y, behavior: 'auto' })
    })
  } catch {
  }
}

export default function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/fr' && pathname !== '/en') return;
    restoreScrollIfSaved();
  }, [pathname]);

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted && (pathname === '/fr' || pathname === '/en')) {
        restoreScrollIfSaved();
      }
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [pathname]);

  return null;
}
