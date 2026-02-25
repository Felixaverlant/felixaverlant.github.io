'use client';

import { createContext, useContext, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, initialLang }: { children: ReactNode; initialLang: Language }) {
  return (
    <LanguageContext.Provider value={{ language: initialLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

function useLanguage () {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
