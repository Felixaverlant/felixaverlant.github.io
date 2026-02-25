import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Félix Averlant - CPO | Chief Product Officer',
    short_name: 'Félix Averlant',
    description: 'CPO (Chief Product Officer) with 10+ years of experience in Tech and Product.',
    start_url: '/fr',
    scope: '/',
    display: 'standalone',
    background_color: '#1a2f42',
    theme_color: '#1a2f42',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
        purpose: 'any',
      },
      {
        src: '/og-image.png',
        sizes: '1200x630',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['portfolio', 'business'],
    lang: 'fr',
    dir: 'ltr',
  };
}
