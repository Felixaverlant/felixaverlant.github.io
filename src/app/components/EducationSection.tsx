'use client';

import { educations } from '../lib/constants';
import { translations } from '../lib/translations';
import Section from './Section';

export default function EducationSection({ lang, fractalVariant, fractalAngleDeg, fractalRotationDeg, headingNoDivider }: { lang: 'fr' | 'en'; fractalVariant?: 'tree' | 'dragon3' | 'dragon4' | 'dragon5' | 'fibonacci10' | 'koch'; fractalAngleDeg?: number; fractalRotationDeg?: number; headingNoDivider?: boolean }) {
  const t = translations[lang];

  return (
    <Section title={t.education.title} ariaLabel={t.education.title} fractalVariant={fractalVariant} fractalAngleDeg={fractalAngleDeg} fractalRotationDeg={fractalRotationDeg} headingNoDivider={headingNoDivider}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-4">
        {educations.map((edu, index) => (
          <div
            key={index}
            className="py-4 pointer-events-none text-left"
          >
            <h3 className="text-xl font-semibold text-theme-dark pointer-events-none">
              {edu.institution}
            </h3>
            <h4 className="text-lg md:text-xl font-normal text-theme-dark/90 mt-1 pointer-events-none">
              {edu.degree}
            </h4>
            <p className="text-lg text-theme-dark/60 mt-0.5 pointer-events-none">
              {edu.period}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
