import type { Metadata } from 'next'
import { Fraunces, DM_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces-var',
  style: ['normal', 'italic'],
  display: 'swap',
  preload: true,
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans-var',
  display: 'swap',
  preload: true,
})

const SITE_URL = 'https://medicus-loop.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MedicusLoop · Rempla MAR en clinique privée — Contrat & LoopExpérience',
    template: '%s · MedicusLoop',
  },
  description:
    'Matchs MAR-clinique avec forfait journalier clair, contrat avec signature électronique et vérification CNOM. LoopExpérience sur mesure incluse. Entièrement gratuit pour les MAR en rempla.',
  keywords: [
    'rempla MAR',
    'rempla anesthésiste',
    'médecin anesthésiste en rempla',
    'clinique privée anesthésiste',
    'contrat de rétrocession MAR',
    'plateforme MAR en rempla',
    'rempla anesthésie clinique privée',
    'MedicusLoop',
  ],
  authors: [{ name: 'MedicusLoop', url: SITE_URL }],
  creator: 'MedicusLoop',
  publisher: 'MedicusLoop',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'MedicusLoop · Rempla MAR en clinique privée — Contrat & LoopExpérience',
    description:
      'Matchs MAR-clinique avec forfait journalier clair, contrat avec signature électronique et vérification CNOM. LoopExpérience sur mesure incluse. Entièrement gratuit pour les MAR en rempla.',
    url: SITE_URL,
    siteName: 'MedicusLoop',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MedicusLoop · Rempla MAR en clinique privée',
    description:
      'Matchs MAR-clinique avec forfait journalier clair, contrat avec signature électronique et LoopExpérience sur mesure. Gratuit pour les MAR en rempla.',
    site: '@medicusloop',
    creator: '@medicusloop',
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90' font-family='serif' font-style='italic'>M</text></svg>",
        type: 'image/svg+xml',
      },
    ],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'MedicusLoop',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo/MedicusLoop_MAR_transparent_FINAL.png`,
      },
      description:
        'Plateforme de mise en relation entre médecins anesthésistes-réanimateurs (MAR) en rempla et cliniques privées en France. Contrat de rempla automatique, vérification CNOM, LoopExpérience sur mesure.',
      email: 'hello@medicus-loop.com',
      foundingDate: '2025',
      areaServed: 'FR',
      knowsAbout: [
        'Rempla médecin anesthésiste',
        'Rempla anesthésie clinique privée',
        'Contrat de rétrocession MAR',
        'Médecin anesthésiste-réanimateur',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'MedicusLoop',
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'fr-FR',
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fr"
      data-theme="light"
      className={`${fraunces.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){
var m=typeof matchMedia==='function'&&matchMedia('(max-width: 991.98px)').matches;
var d=m?'dark':'light';
try{
var t=localStorage.getItem('medicusloop-theme');
document.documentElement.setAttribute('data-theme',(t==='dark'||t==='light')?t:d);
}catch(e){
document.documentElement.setAttribute('data-theme',d);
}
})();`,
          }}
        />
        {/* Preconnect critique */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Material Symbols — chargement non-bloquant */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body>
        {children}
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
