'use client';

import Section from './Section';
import type { Lang } from '../lib/utils';

type TranslatableItem = { fr: string; en: string };

type SimpleListSectionProps = {
  title: string;
  ariaLabel: string;
  items: string[] | TranslatableItem[];
  lang: Lang;
  fractalVariant?: 'tree' | 'dragon3' | 'dragon4' | 'dragon5' | 'fibonacci10' | 'koch';
  fractalAngleDeg?: number;
  fractalRotationDeg?: number;
  headingNoDivider?: boolean;
};

function isTranslatable(item: string | TranslatableItem): item is TranslatableItem {
  return typeof item === 'object' && item !== null && 'fr' in item && 'en' in item;
}

export default function SimpleListSection({ title, ariaLabel, items, lang, fractalVariant, fractalAngleDeg, fractalRotationDeg, headingNoDivider }: SimpleListSectionProps) {
  return (
    <Section title={title} ariaLabel={ariaLabel} fractalVariant={fractalVariant} fractalAngleDeg={fractalAngleDeg} fractalRotationDeg={fractalRotationDeg} headingNoDivider={headingNoDivider}>
      <ul className="list-disc pl-5 space-y-1 text-lg md:text-xl text-theme-dark/85 mt-4 pointer-events-none">
        {items.map((item, index) => {
          const text = isTranslatable(item) ? item[lang] : item
          const parts = text.split(' / ')
          return (
            <li key={index} className="pointer-events-none">
              {parts.map((part, i) => (
                <span key={i}>
                  {i > 0 && (
                    <span style={{ color: '#C4622D' }}> / </span>
                  )}
                  {part}
                </span>
              ))}
            </li>
          )
        })}
      </ul>
    </Section>
  );
}
