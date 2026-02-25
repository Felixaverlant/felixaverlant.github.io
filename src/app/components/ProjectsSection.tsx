'use client';

import { projects } from '../lib/constants';
import type { Project } from '../lib/constants';
import { translations } from '../lib/translations';
import GitHubIcon from './GitHubIcon';
import Section from './Section';

const SCROLL_RESTORE_KEY = 'felixaverlant-home-scroll';

function saveScrollBeforeLeave() {
  if (typeof window !== 'undefined') {
    try {
      window.sessionStorage.setItem(SCROLL_RESTORE_KEY, String(window.scrollY))
    } catch {
    }
  }
}

function ProjectCard({ project, lang, showYear }: { project: Project; lang: 'fr' | 'en'; showYear?: boolean }) {
  return (
    <div className="py-6 first:pt-6 pointer-events-auto">
      <h3 className="text-xl font-semibold text-theme-dark mb-2 pointer-events-none flex items-baseline gap-2 flex-wrap">
        <a
          href={`/${lang}/projects/${project.slug}`}
          className="transition-colors pointer-events-auto"
          onClick={saveScrollBeforeLeave}
        >
          {project.title[lang]} ↗
        </a>
        {showYear && project.year != null && (
          <span className="text-base font-normal text-theme-dark/70 tabular-nums">{project.year}</span>
        )}
      </h3>
      <p className="text-lg md:text-xl text-theme-dark/80 pointer-events-none">
        {project.description[lang]}
      </p>
    </div>
  );
}

const sideProjectsList = projects
  .filter((p) => !p.url.includes('sustainsoft'))
  .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));

export default function ProjectsSection({ lang, fractalVariant, fractalAngleDeg, fractalRotationDeg, headingNoDivider }: { lang: 'fr' | 'en'; fractalVariant?: 'tree' | 'dragon3' | 'dragon4' | 'dragon5' | 'fibonacci10' | 'koch'; fractalAngleDeg?: number; fractalRotationDeg?: number; headingNoDivider?: boolean }) {
  const t = translations[lang];
  const sustainsoft = projects.find((p) => p.url.includes('sustainsoft'));

  return (
    <Section title={t.projects.title} ariaLabel={t.projects.title} fractalVariant={fractalVariant} fractalAngleDeg={fractalAngleDeg} fractalRotationDeg={fractalRotationDeg} headingNoDivider={headingNoDivider}>
      <div>
        {sustainsoft && <ProjectCard key="sustainsoft" project={sustainsoft} lang={lang} />}
      </div>
    </Section>
  );
}

const GITHUB_URL = 'https://github.com/Felixaverlant';

export function SideProjectsSection({ lang, fractalVariant, fractalAngleDeg, fractalRotationDeg, headingNoDivider }: { lang: 'fr' | 'en'; fractalVariant?: 'tree' | 'dragon3' | 'dragon4' | 'dragon5' | 'fibonacci10' | 'koch'; fractalAngleDeg?: number; fractalRotationDeg?: number; headingNoDivider?: boolean }) {
  const t = translations[lang];
  const githubLink = (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex ml-1.5 align-middle text-theme-dark hover:opacity-80 transition-opacity"
      aria-label="GitHub"
    >
      <GitHubIcon className="w-5 h-5" />
    </a>
  );
  return (
    <Section title={t.projects.sideProjects} titleAfterSlash={githubLink} ariaLabel={t.projects.sideProjects} fractalVariant={fractalVariant} fractalAngleDeg={fractalAngleDeg} fractalRotationDeg={fractalRotationDeg} headingNoDivider={headingNoDivider}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {sideProjectsList.map((project, index) => (
          <ProjectCard key={index} project={project} lang={lang} showYear />
        ))}
      </div>
    </Section>
  );
}
