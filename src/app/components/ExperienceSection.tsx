'use client';

import { experiences } from '../lib/constants';
import { translations } from '../lib/translations';
import Section from './Section';
import ExternalLinkIcon from './ExternalLinkIcon';

export default function ExperienceSection({ lang, fractalAngleDeg, fractalRotationDeg, firstSection }: { lang: 'fr' | 'en'; fractalAngleDeg?: number; fractalRotationDeg?: number; firstSection?: boolean }) {
  const t = translations[lang];

  return (
    <Section title={t.experience.title} ariaLabel={t.experience.title} variant="compact" fractalAngleDeg={fractalAngleDeg} fractalRotationDeg={fractalRotationDeg} animatedDivider firstSection={firstSection}>
      <div>
        {experiences.map((exp, index) => (
          <div key={index} className="py-12 first:pt-6 pointer-events-auto">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.8fr] md:gap-8 lg:gap-12 gap-4">
              <div className="flex flex-col">
                <h3 className="text-xl md:text-2xl font-semibold text-theme-dark mb-1">
                  {exp.role[lang]}
                </h3>
                {exp.companyUrl ? (
                  <a
                    href={exp.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-lg md:text-xl text-theme-dark/90 transition-colors w-fit"
                  >
                    {exp.company[lang]}
                    <ExternalLinkIcon className="shrink-0 opacity-80" />
                  </a>
                ) : (
                  <p className="text-lg md:text-xl text-theme-dark/90">{exp.company[lang]}</p>
                )}
                {exp.companyType && (
                  <p className="text-base md:text-lg text-theme-dark/60 mt-0.5 italic">{exp.companyType[lang]}</p>
                )}
                <p className="text-lg text-theme-dark/60 mt-0.5">{exp.period[lang]}</p>
                <p className="text-lg text-theme-dark/60">{exp.location[lang]}</p>
              </div>
              <div className="space-y-4">
                {exp.responsibilities.map((resp, respIndex) => (
                  <div key={`${resp.category[lang]}-${respIndex}`} className="pt-4 first:pt-0">
                    <p className="text-xs md:text-sm font-medium text-theme-dark/70 uppercase tracking-[0.3em] mb-2">
                      {resp.category[lang]}
                    </p>
                    <ul className="list-none pl-0 space-y-2 text-lg md:text-xl text-theme-dark/85">
                      {resp.items.map((item, itemIndex) => {
                        const parts = item[lang].split(' / ')
                        return (
                          <li key={`${resp.category[lang]}-${itemIndex}`} className="flex gap-2">
                            <span className="text-theme-dark/60 mt-1.5 shrink-0 size-1.5 rounded-full bg-current" aria-hidden />
                            <span>
                              {parts.map((part, i) => (
                                <span key={i}>
                                  {i > 0 && (
                                    <span style={{ color: '#C4622D' }}> / </span>
                                  )}
                                  {part}
                                </span>
                              ))}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
