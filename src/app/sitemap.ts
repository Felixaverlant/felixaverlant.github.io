import { MetadataRoute } from 'next'
import { SITE_URL, projects } from './lib/constants'

export const dynamic = 'force-static'

export default function sitemap (): MetadataRoute.Sitemap {
  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/fr/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: {
      languages: {
        fr: `${SITE_URL}/fr/projects/${p.slug}`,
        en: `${SITE_URL}/en/projects/${p.slug}`,
      },
    },
  }))
  return [
    {
      url: `${SITE_URL}/fr`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
      alternates: {
        languages: {
          fr: `${SITE_URL}/fr`,
          en: `${SITE_URL}/en`,
        },
      },
    },
    {
      url: `${SITE_URL}/en`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
      alternates: {
        languages: {
          fr: `${SITE_URL}/fr`,
          en: `${SITE_URL}/en`,
        },
      },
    },
    ...projectEntries,
  ]
}
