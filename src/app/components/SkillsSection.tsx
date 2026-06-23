'use client';

import { skills } from '../lib/constants';
import type { Bilingual } from '../lib/constants';
import { translations } from '../lib/translations';
import Section from './Section';

function SkillItems({ items, lang }: { items: Bilingual[]; lang: 'fr' | 'en' }) {
  return (
    <ul className="list-disc pl-5 space-y-1 text-lg md:text-xl text-theme-dark/85 pointer-events-none">
      {items.map((item, itemIndex) => {
        const parts = item[lang].split(' / ')
        return (
          <li key={itemIndex} className="pointer-events-none">
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
  )
}

export default function SkillsSection({ lang, fractalVariant, fractalRotationDeg, fractalSteps, headingNoDivider }: { lang: 'fr' | 'en'; fractalVariant?: 'fibonacci'; fractalRotationDeg?: number; fractalSteps?: number; headingNoDivider?: boolean }) {
  const t = translations[lang]

  return (
    <Section title={t.skills.title} ariaLabel={t.skills.title} fractalVariant={fractalVariant} fractalRotationDeg={fractalRotationDeg} fractalSteps={fractalSteps} headingNoDivider={headingNoDivider}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
        {skills.map((skill, index) => (
          <div key={index} className="py-6 first:pt-6 pointer-events-none">
            <h4
              className={`text-base font-semibold text-theme-dark mb-2 pointer-events-none ${index === 0 ? 'font-bold' : ''}`}
            >
              {skill.category[lang]}
            </h4>
            {skill.items && <SkillItems items={skill.items} lang={lang} />}
            {skill.subsections?.map((subsection, subIndex) => (
              <div key={subIndex} className="mt-4 first:mt-3">
                <h4 className="text-base font-semibold text-theme-dark mb-2 pointer-events-none">
                  {subsection.title[lang]}
                </h4>
                <SkillItems items={subsection.items} lang={lang} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </Section>
  )
}
