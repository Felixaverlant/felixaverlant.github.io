type Lang = 'fr' | 'en'

import { translations } from './translations'
import { SITE_URL, schemaKnowsAbout } from './constants'

const SOCIAL_PROFILES = {
  linkedIn: translations.fr.linkedin.url,
  github: 'https://github.com/felixaverlant',
  twitter: '',
}

export function generateStructuredData (lang: Lang | undefined) {
  const validLang: Lang = (lang === 'fr' || lang === 'en') ? lang : 'fr'
  
  const sameAs = [
    SOCIAL_PROFILES.linkedIn,
    SOCIAL_PROFILES.github,
  ].filter(Boolean);
  
  if (SOCIAL_PROFILES.twitter) {
    sameAs.push(SOCIAL_PROFILES.twitter);
  }

  const schemaTranslations = {
    fr: {
      jobTitle: 'CPO (Chief Product Officer)',
      description: 'CPO avec 10+ ans d\'expérience en Tech et Produit. Recherche d\'opportunités en France (télétravail), Suisse, États-Unis ou Canada.',
      locationPreferences: [
        'France (télétravail)',
        'Suisse',
        'États-Unis',
        'Canada',
      ],
    },
    en: {
      jobTitle: 'CPO (Chief Product Officer)',
      description: 'CPO with 10+ years of experience in Tech and Product. Seeking opportunities in France (remote), Switzerland, United States, or Canada.',
      locationPreferences: [
        'France (remote)',
        'Switzerland',
        'United States',
        'Canada',
      ],
    },
  };

  const t = schemaTranslations[validLang]
  const knowsAbout = schemaKnowsAbout.map((s) => s[validLang])

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Félix Averlant',
    jobTitle: t.jobTitle,
    description: t.description,
    url: `${SITE_URL}/${validLang}`,
    sameAs: sameAs,
    knowsAbout,
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Chief Product Officer',
      occupationLocation: {
        '@type': 'Country',
        name: t.locationPreferences,
      },
    },
    alumniOf: [
      {
        '@type': 'Organization',
        name: 'Sustainsoft',
      },
      {
        '@type': 'Organization',
        name: 'Adot',
      },
      {
        '@type': 'Organization',
        name: 'Altima',
      },
      {
        '@type': 'Organization',
        name: 'MFG Labs',
      },
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Sustainsoft',
      jobTitle: 'CPTO',
    },
  };
}
