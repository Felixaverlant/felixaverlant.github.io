'use client';

import { useState, useCallback } from 'react';
import { publications } from '../lib/constants';
import { translations } from '../lib/translations';
import Section from './Section';

const INITIAL_COUNT = 3;
const REVEAL_DURATION_MS = 450;
const STAGGER_MS = 80;

export default function PublicationsSection({ lang, fractalVariant, fractalAngleDeg, fractalRotationDeg, headingNoDivider }: { lang: 'fr' | 'en'; fractalVariant?: 'tree' | 'dragon3' | 'dragon4' | 'dragon5' | 'fibonacci10' | 'koch'; fractalAngleDeg?: number; fractalRotationDeg?: number; headingNoDivider?: boolean }) {
  const t = translations[lang];
  const [showAll, setShowAll] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleToggle = useCallback(() => {
    if (showAll) {
      setIsExiting(true);
      const extraCount = publications.length - INITIAL_COUNT;
      const exitDuration = (extraCount - 1) * STAGGER_MS + REVEAL_DURATION_MS;
      setTimeout(() => {
        setShowAll(false);
        setIsExiting(false);
      }, exitDuration);
    } else {
      setShowAll(true);
    }
  }, [showAll]);

  if (publications.length === 0) return null;

  const visiblePublications = showAll || isExiting ? publications : publications.slice(0, INITIAL_COUNT);
  const hasMore = publications.length > INITIAL_COUNT;
  const isHiding = isExiting;

  return (
    <Section title={t.publications.title} ariaLabel={t.publications.title} fractalVariant={fractalVariant} fractalAngleDeg={fractalAngleDeg} fractalRotationDeg={fractalRotationDeg} headingNoDivider={headingNoDivider}>
      <p className="text-base md:text-lg text-theme-dark/85 leading-relaxed pointer-events-none">
        {t.publications.description}
      </p>
      <ul className="space-y-4 mt-4 pointer-events-none">
        {visiblePublications.map((pub, index) => {
          const isExtra = index >= INITIAL_COUNT;
          const isNewlyRevealed = showAll && !isExiting && isExtra;
          const isHidingItem = isHiding && isExtra;
          const revealClass = isNewlyRevealed ? 'publication-reveal' : '';
          const hideClass = isHidingItem ? 'publication-hide' : '';
          const delay = isExtra ? (index - INITIAL_COUNT) * STAGGER_MS : 0;
          return (
          <li
            key={index}
            className={`pointer-events-none ${revealClass} ${hideClass}`}
            style={isNewlyRevealed || isHidingItem ? { animationDelay: `${delay}ms` } : undefined}
          >
            <a
              href={pub.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg md:text-xl text-theme-dark/85 hover:text-theme-dark transition-colors pointer-events-auto inline-flex items-center gap-2 font-medium"
            >
              {pub.title}
              <span className="text-theme-dark/60">↗</span>
            </a>
            <p className="text-lg md:text-xl text-theme-dark/75 mt-1 pl-0 pointer-events-none">
              {pub.description[lang].split(' / ').map((part, i) => (
                <span key={i}>
                  {i > 0 && (
                    <span style={{ color: '#C4622D' }}> / </span>
                  )}
                  {part}
                </span>
              ))}
            </p>
          </li>
          )
        })}
      </ul>
      {hasMore && (
        <button
          type="button"
          onClick={handleToggle}
          disabled={isExiting}
          className="mt-4 text-lg md:text-xl font-medium text-theme-dark/85 hover:text-theme-dark transition-colors underline decoration-current underline-offset-2 pointer-events-auto cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {showAll ? t.publications.seeLess : t.publications.seeMore}
        </button>
      )}
    </Section>
  );
}
