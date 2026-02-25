'use client';

import { LanguageProvider } from './contexts/LanguageContext';

export function Providers({ children, lang }: { children: React.ReactNode; lang: 'fr' | 'en' }) {
  return <LanguageProvider initialLang={lang}>{children}</LanguageProvider>;
}