'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function LanguageToggle({
  currentLang,
  position = 'fixed',
  noPosition = false,
}: {
  currentLang: 'fr' | 'en';
  position?: 'fixed' | 'absolute';
  noPosition?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  
  const toggleLanguage = () => {
    const newLang = currentLang === 'fr' ? 'en' : 'fr'
    const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`)
    router.push(newPath);
  };

  const positionClasses = noPosition ? '' : position === 'fixed' 
    ? 'fixed top-4 right-4 md:top-6 md:right-6 z-50' 
    : 'absolute top-4 right-4 md:top-6 md:right-6 z-50';

  return (
    <button
      onClick={toggleLanguage}
      className={`${positionClasses} link-hover-style cursor-pointer px-2 py-0.5 md:px-3 md:py-1 text-2xl md:text-3xl font-normal leading-tight transition-colors text-theme-dark focus:outline-none focus:ring-2 focus:ring-theme-mint focus:ring-offset-2 focus:ring-offset-theme-bg`}
      aria-label={`Switch to ${currentLang === 'fr' ? 'English' : 'Français'}`}
    >
      {currentLang === 'fr' ? 'en' : 'fr'}
    </button>
  );
}
