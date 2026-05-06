import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Fraunces, DM_Sans } from 'next/font/google'
import Script from 'next/script'
import { GoogleTagManagerHead, GoogleTagManagerNoscript } from './_components/google-tag-manager'
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

/** Titre / accroche partagés (OG, Twitter, onglet) — ton LinkedIn & RS : explicite, sans jargon « rempla ». */
const OG_SITE_TITLE = 'MedicusLoop · Remplacement MAR — matching, contrat et LoopExpérience'
const OG_SITE_DESCRIPTION =
  'MedicusLoop met en relation MAR et structures de santé : forfait journalier explicite, contrat avec signature électronique, vérification CNOM. Moins de friction administrative — plus de temps pour le soin.'

/** Origine Supabase pour preconnect (sans lever si l’URL d’env est invalide). */
function supabaseOriginForHints(): string | null {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!raw?.trim()) return null
  try {
    return new URL(raw.trim()).origin
  } catch {
    return null
  }
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: OG_SITE_TITLE,
    template: '%s · MedicusLoop',
  },
  description: OG_SITE_DESCRIPTION,
  keywords: [
    'remplacement MAR',
    'médecin anesthésiste remplaçant',
    'recrutement MAR',
    'structure de santé',
    'contrat de rétrocession MAR',
    'plateforme MAR',
    'matching MAR',
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
    title: OG_SITE_TITLE,
    description: OG_SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: 'MedicusLoop',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: OG_SITE_TITLE,
    description: OG_SITE_DESCRIPTION,
    site: '@medicusloop',
    creator: '@medicusloop',
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
        'Plateforme de mise en relation entre médecins anesthésistes-réanimateurs (MAR) et structures de santé en France. Contrat de remplacement assisté, vérification CNOM, LoopExpérience sur mesure.',
      email: 'hello@medicus-loop.com',
      foundingDate: '2025',
      areaServed: 'FR',
      knowsAbout: [
        'Remplacement médecin anesthésiste',
        'Remplacement MAR en structure de santé',
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
  const supabaseOrigin = supabaseOriginForHints()

  return (
    <html
      lang="fr"
      data-theme="light"
      className={`${fraunces.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <GoogleTagManagerHead />
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
        {/* Axeptio — chargement SDK (preconnect ici, scripts en tête de <body>) */}
        <link rel="preconnect" href="https://static.axept.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://static.axept.io" />
        {/* Preconnect critique */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {supabaseOrigin ? (
          <>
            <link rel="dns-prefetch" href={supabaseOrigin} />
            <link rel="preconnect" href={supabaseOrigin} crossOrigin="anonymous" />
          </>
        ) : null}
        {/* GA / mesure — souvent invoqués via GTM après consentement */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        {/* Partage (liens du bloc public) — résolution DNS en avance, sans preconnect agressif */}
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://www.linkedin.com" />
        <link rel="dns-prefetch" href="https://www.facebook.com" />
        <link rel="dns-prefetch" href="https://twitter.com" />
        <link rel="dns-prefetch" href="https://www.instagram.com" />
        {/* Material Symbols — chargement non-bloquant */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body>
        <GoogleTagManagerNoscript />
        {/*
          Axeptio : config puis SDK en deux scripts beforeInteractive (évite l’IIFE insertBefore
          sur le 1er <script>, fragile avec Next). À charger avant le reste — voir support Axeptio.
        */}
        <Script
          id="axeptio-settings"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.axeptioSettings={clientId:"69fa81c62584b79a6f940428",cookiesVersion:"029bbdd5-b329-4b84-9c94-645dbda2fb53"};`,
          }}
        />
        <Script
          id="axeptio-sdk"
          src="https://static.axept.io/sdk.js"
          strategy="beforeInteractive"
        />
        {children}
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="afterInteractive"
        />
        <Analytics />
      </body>
    </html>
  )
}
