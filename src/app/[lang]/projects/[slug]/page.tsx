import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PageLayout from '../../../components/PageLayout'
import { projects, SITE_URL } from '../../../lib/constants'
import { resolveLang, resolveParams, type Lang } from '../../../lib/utils'
export function generateStaticParams () {
  const langs: Lang[] = ['fr', 'en']
  return projects.flatMap((p) => langs.map((lang) => ({ lang, slug: p.slug })))
}

export async function generateMetadata ({
  params,
}: {
  params: { lang: string; slug: string } | Promise<{ lang: string; slug: string }>
}) {
  const resolved = await resolveParams(params)
  const lang = resolveLang(resolved)
  const project = projects.find((p) => p.slug === resolved.slug)
  if (!project) return { title: 'Project | Félix Averlant' }
  const title = `${project.title[lang]} | Félix Averlant | CPO`
  const description = (project.longDescription ?? project.description)[lang]
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lang}/projects/${project.slug}`,
      siteName: 'Félix Averlant',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/${lang}/projects/${project.slug}`,
      languages: {
        fr: `${SITE_URL}/fr/projects/${project.slug}`,
        en: `${SITE_URL}/en/projects/${project.slug}`,
        'x-default': `${SITE_URL}/fr/projects/${project.slug}`,
      },
    },
  }
}

export default async function ProjectPage ({
  params,
}: {
  params: { lang: string; slug: string } | Promise<{ lang: string; slug: string }>
}) {
  const resolved = await resolveParams(params)
  const lang: Lang = resolveLang(resolved)
  const project = projects.find((p) => p.slug === resolved.slug)
  if (!project) notFound()

  const body = (project.longDescription ?? project.description)[lang]
  const paragraphs = project.paragraphs

  return (
    <PageLayout fractalInContent>
      <main className="pt-12 md:pt-16 pb-12 md:pb-20 pointer-events-none">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-6">
          <Link
            href={`/${lang}`}
            className="text-theme-dark/70 hover:text-theme-dark transition-colors pointer-events-auto inline-block mb-6"
          >
            ← Back
          </Link>
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-normal mb-8 md:mb-12 tracking-tight pointer-events-none text-theme-dark">
            {project.title[lang]}
          </h1>
          <div className="mb-10 md:mb-12 space-y-6">
            {paragraphs && paragraphs.length > 0
              ? paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className={`text-lg md:text-xl lg:text-2xl font-normal text-theme-dark/80 leading-relaxed pointer-events-none ${i === paragraphs.length - 1 ? 'italic' : ''}`}
                  >
                    {p[lang]}
                  </p>
                ))
              : (
                  <p className="text-lg md:text-xl lg:text-2xl font-normal text-theme-dark/80 leading-relaxed pointer-events-none">
                    {body}
                  </p>
                )}
          </div>
          {project.url?.endsWith('.html') && project.slug !== 'last-metro' && project.slug !== 'kriptyq' && project.slug !== 'sustainsoft' && (
            <div className="mb-10 md:mb-12 pointer-events-auto w-full min-h-[600px] rounded-lg overflow-hidden border border-theme-dark/10 bg-theme-bg">
              <iframe
                title={project.title[lang]}
                src={project.url}
                className="w-full h-[min(80vh,900px)] min-h-[600px] border-0"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          )}
          {project.images && project.images.length > 0 && (
            <div className="flex flex-col gap-6 md:gap-8">
              {project.images.map((src) => (
                <div key={src} className="relative w-full aspect-4/3 rounded-lg overflow-hidden bg-theme-bg">
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-contain pointer-events-none"
                    sizes="100vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </PageLayout>
  )
}
