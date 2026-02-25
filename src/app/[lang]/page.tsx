import type { Metadata } from 'next';
import HeaderToggles from '../components/HeaderToggles';
import ExperienceSection from '../components/ExperienceSection';
import EducationSection from '../components/EducationSection';
import SkillsSection from '../components/SkillsSection';
import PublicationsSection from '../components/PublicationsSection';
import ProjectsSection, { SideProjectsSection } from '../components/ProjectsSection';
import SimpleListSection from '../components/SimpleListSection';
import ContactLinkRow from '../components/ContactLinkRow';
import AboutParagraph from '../components/AboutParagraph';
import AnimatedDivider from '../components/AnimatedDivider';
import PageLayout from '../components/PageLayout';
import { translations } from '../lib/translations';
import { SITE_URL, PROFILE_IMAGE, interests } from '../lib/constants';
import { resolveLang, resolveParams, type Lang } from '../lib/utils';
import { withLangMetadata } from '../lib/metadata';

function getMetaFromTranslations(t: (typeof translations)['fr']) {
  const description = `${t.aboutMe.text} ${t.bioHeadingCta}`;
  const ogTitle = t.title.split(' | ').slice(0, 2).join(' | ');
  return { title: t.title, description, ogTitle };
}

export function generateMetadata({ params }: { params: { lang: Lang } | Promise<{ lang: Lang }> }) {
  return withLangMetadata(params, (lang) => {
    const t = translations[lang];
    const meta = getMetaFromTranslations(t);
    return {
      title: meta.title,
      description: meta.description,
      openGraph: {
        title: meta.ogTitle,
        description: meta.description,
        url: `${SITE_URL}/${lang}`,
      },
    };
  });
}

export default async function Home({ params }: { params: { lang: Lang } | Promise<{ lang: Lang }> }) {
  const resolvedParams = await resolveParams(params);
  const lang: Lang = resolveLang(resolvedParams);
  const t = translations[lang];

  return (
    <PageLayout fractalInContent>
      <main className="relative w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="relative z-10">
          <header className="relative flex items-start justify-between w-full pt-4 md:pt-6 lg:pt-6 pb-[160px] overflow-visible">
            <div className="relative z-10 flex items-center gap-4 flex-1 min-w-0">
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-4 min-w-0">
                  <h1 className="text-2xl md:text-3xl font-normal text-theme-dark leading-tight">
                    {t.nameFirst} {t.nameLast},
                  </h1>
                  <HeaderToggles currentLang={lang} position="relative" />
                </div>
                <p className="text-lg md:text-xl font-normal text-theme-dark/60 leading-tight mt-1">
                  Chief Product Officer
                </p>
              </div>
            </div>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-12 lg:items-start">
            <aside id="contact" className="lg:col-span-1 flex flex-col lg:sticky lg:top-24 lg:self-start" aria-label={lang === 'fr' ? 'Présentation' : 'Introduction'}>
              <AnimatedDivider />
              <AboutParagraph
                text={t.aboutMe.text}
                aboutLink={t.aboutMe.aboutLink}
                whoIAm={t.aboutModal.whoIAm}
                whatIWant={t.aboutModal.whatIWant}
                lang={lang}
                profileImage={PROFILE_IMAGE}
              />
              <ContactLinkRow
                href={t.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-dark/90 leading-relaxed !font-bold"
              >
                {t.bioHeadingCta}{' '}
                <span className="!font-bold">{t.contactMe}</span>
              </ContactLinkRow>
              <div className="flex flex-col">
                <ContactLinkRow href={t.linkedin.url} target="_blank" rel="noopener noreferrer">
                  {t.aboutMe.ctaLinkedIn} ↗
                </ContactLinkRow>
                <ContactLinkRow href={`/resume-${lang}.pdf`} download aria-label={t.resume.download}>
                  {t.aboutMe.ctaCv} ↗
                </ContactLinkRow>
              </div>
            </aside>

            <div id="content" className="lg:col-span-2 pt-8 lg:pt-0 pb-12 md:pb-20 relative" role="region" aria-label={lang === 'fr' ? 'Parcours et compétences' : 'Experience and skills'}>
              <ExperienceSection lang={lang} firstSection />
              <SkillsSection lang={lang} fractalVariant="dragon3" headingNoDivider />
              <EducationSection lang={lang} fractalVariant="dragon3" headingNoDivider />
              <PublicationsSection lang={lang} fractalVariant="dragon4" headingNoDivider />
              <ProjectsSection lang={lang} fractalVariant="dragon5" headingNoDivider />
              <SimpleListSection
                title={t.interests.title}
                ariaLabel={t.interests.title}
                items={interests}
                lang={lang}
                fractalVariant="fibonacci10"
                headingNoDivider
              />
              <SideProjectsSection lang={lang} fractalVariant="koch" headingNoDivider />
            </div>
          </div>
          </div>
        </main>
    </PageLayout>
  );
}
