'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function LangTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  useEffect(() => {
    const lang = pathname.startsWith('/en') ? 'en' : 'fr'
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [pathname]);

  return <>{children}</>;
}
