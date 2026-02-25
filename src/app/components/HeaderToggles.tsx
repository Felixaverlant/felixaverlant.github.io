'use client';

import LanguageToggle from './LanguageToggle';

export default function HeaderToggles({
  currentLang,
  position = 'fixed',
  children,
}: {
  currentLang: 'fr' | 'en';
  position?: 'fixed' | 'absolute' | 'relative';
  children?: React.ReactNode;
}) {
  const positionClasses = position === 'fixed'
    ? 'fixed top-4 right-4 md:top-6 md:right-6'
    : position === 'absolute'
      ? 'absolute top-4 right-4 md:top-6 md:right-6'
      : 'relative';

  return (
    <div className={`${positionClasses} z-50 flex flex-wrap items-center justify-end gap-2 sm:gap-3 md:gap-4`}>
      {children}
      <LanguageToggle currentLang={currentLang} noPosition />
    </div>
  );
}
