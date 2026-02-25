'use client';

import { skills } from '../lib/constants';
import { translations } from '../lib/translations';
import Section from './Section';

export default function SkillsSection({ lang, fractalVariant, fractalAngleDeg, fractalRotationDeg, headingNoDivider }: { lang: 'fr' | 'en'; fractalVariant?: 'tree' | 'dragon3' | 'dragon4' | 'dragon5' | 'fibonacci10' | 'koch'; fractalAngleDeg?: number; fractalRotationDeg?: number; headingNoDivider?: boolean }) {
  const t = translations[lang]

  return (
    <Section title={t.skills.title} ariaLabel={t.skills.title} fractalVariant={fractalVariant} fractalAngleDeg={fractalAngleDeg} fractalRotationDeg={fractalRotationDeg} headingNoDivider={headingNoDivider}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
        {skills.map((skill, index) => (
          <div key={index} className="py-6 first:pt-6 pointer-events-none">
            <h4
              className={`text-base font-semibold text-theme-dark mb-2 pointer-events-none ${index === 0 ? 'font-bold' : ''}`}
            >
              {skill.category[lang]}
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-lg md:text-xl text-theme-dark/85 pointer-events-none">
              {skill.items.map((item, itemIndex) => {
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
          </div>
        ))}
      </div>
    </Section>
  )
}
