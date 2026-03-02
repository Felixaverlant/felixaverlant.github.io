import type { Metadata } from "next";
import { Barlow } from 'next/font/google';
import { twMerge } from 'tailwind-merge';
import { Providers } from "../providers";
import { generateStructuredData } from '../lib/structuredData';
import { SITE_URL } from '../lib/constants';
import { resolveLang, resolveParams, type Lang } from '../lib/utils';
import LangTemplate from './template';
import ScrollRestoration from '../components/ScrollRestoration';
import '../globals.css';

const barlow = Barlow({
  variable: "--font-sans",
  weight: ['200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: { icon: "/favicon.ico", apple: "/og-image.png" },
  openGraph: { type: "website", siteName: "Félix Averlant" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, email: false },
};

const metadataByLang: Record<Lang, Metadata> = {
  fr: {
    title: "Félix Averlant - CPO | Chief Product Officer | France, Suisse, US, Canada",
    description: "CPO (Chief Product Officer) avec 10+ ans d'expérience en Tech et Produit. Recherche d'opportunités en France (télétravail), Suisse, États-Unis ou Canada. Expertise en leadership produit, stratégie tech et expérience utilisateur.",
    keywords: "CPO, Chief Product Officer, CPTO, Product Leadership, Tech Leadership, France remote, Suisse, États-Unis, Canada, Product Management, 10+ ans expérience, Senior Product Executive",
    openGraph: {
      title: "Félix Averlant - CPO | Chief Product Officer",
      description: "CPO avec 10+ ans d'expérience en Tech et Produit. Recherche d'opportunités en France (télétravail), Suisse, États-Unis ou Canada.",
      url: `${SITE_URL}/fr`,
      siteName: "Félix Averlant",
      locale: "fr_FR",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Félix Averlant - CPO",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Félix Averlant - CPO | Chief Product Officer",
      description: "CPO avec 10+ ans d'expérience en Tech et Produit. Recherche d'opportunités en France (télétravail), Suisse, États-Unis ou Canada.",
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `${SITE_URL}/fr`,
      languages: {
        'fr': `${SITE_URL}/fr`,
        'en': `${SITE_URL}/en`,
        'x-default': `${SITE_URL}/fr`,
      },
    },
  },
  en: {
    title: "Félix Averlant - CPO | Chief Product Officer | France, Switzerland, US, Canada",
    description: "CPO (Chief Product Officer) with 10+ years of experience in Tech and Product. Seeking opportunities in France (remote), Switzerland, United States, or Canada. Expertise in product leadership, tech strategy, and user experience.",
    keywords: "CPO, Chief Product Officer, CPTO, Product Leadership, Tech Leadership, France remote, Switzerland, United States, Canada, Product Management, 10+ years experience, Senior Product Executive",
    openGraph: {
      title: "Félix Averlant - CPO | Chief Product Officer",
      description: "CPO with 10+ years of experience in Tech and Product. Seeking opportunities in France (remote), Switzerland, United States, or Canada.",
      url: `${SITE_URL}/en`,
      siteName: "Félix Averlant",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Félix Averlant - CPO",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Félix Averlant - CPO | Chief Product Officer",
      description: "CPO with 10+ years of experience in Tech and Product. Seeking opportunities in France (remote), Switzerland, United States, or Canada.",
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `${SITE_URL}/en`,
      languages: {
        'fr': `${SITE_URL}/fr`,
        'en': `${SITE_URL}/en`,
        'x-default': `${SITE_URL}/fr`,
      },
    },
  },
};

export function generateMetadata({ params }: { params: { lang: string } | Promise<{ lang: string }> }): Metadata | Promise<Metadata> {
  const merge = (langMeta: Metadata) => ({ ...baseMetadata, ...langMeta });
  if (params instanceof Promise) {
    return params.then(resolvedParams => merge(metadataByLang[resolveLang(resolvedParams)] || metadataByLang.fr));
  }
  return merge(metadataByLang[resolveLang(params)] || metadataByLang.fr);
}

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }];
}

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string } | Promise<{ lang: string }>;
}>) {
  const resolvedParams = await resolveParams(params);
  const lang: Lang = resolveLang(resolvedParams);
  const structuredData = generateStructuredData(lang);
  const isProduction = process.env.NODE_ENV === 'production'

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1a2f42" />
        {isProduction && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WB4X5Q6');`,
            }}
          />
        )}
      </head>
      <body
        className={twMerge(`${barlow.variable} antialiased font-sans bg-theme-bg text-theme-dark`)}
        style={{ backgroundColor: '#1a2f42', color: '#f5f0e6' }}
      >
        {isProduction && (
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-WB4X5Q6"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
              title="Google Tag Manager"
            />
          </noscript>
        )}
        <LangTemplate>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
          <Providers lang={lang}>
            <ScrollRestoration />
            {children}
          </Providers>
        </LangTemplate>
      </body>
    </html>
  );
}
