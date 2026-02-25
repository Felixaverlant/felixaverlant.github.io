import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SITE_URL } from '../lib/constants'
import '../globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Félix Averlant - CPO | Chief Product Officer",
  description: "CPO (Chief Product Officer) with 10+ years of experience in Tech and Product",
  robots: { index: true, follow: true },
}

export default function IndexLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}
