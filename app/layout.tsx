import type { Metadata } from 'next'
import { Fraunces, DM_Sans } from 'next/font/google'
import Script from 'next/script'
import {
  OG_IMAGE_ALT,
  OG_IMAGE_URL,
  OG_SITE_DESCRIPTION,
  OG_SITE_TITLE,
  SITE_URL,
} from '@/lib/site-metadata'
import '@fontsource-variable/material-symbols-outlined/full.css'
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

/** Conteneur GTM public. Surcharge possible : `NEXT_PUBLIC_GTM_ID=GTM-XXXX` dans `.env.local`. */
function gtmContainerId(): string {
  const raw = (process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-PQLS8DFS').trim()
  return /^GTM-[A-Z0-9]+$/i.test(raw) ? raw : 'GTM-PQLS8DFS'
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
    'MAR titulaire remplacé',
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
    images: [{ url: OG_IMAGE_URL, width: 2400, height: 1260, alt: OG_IMAGE_ALT, type: 'image/jpeg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: OG_SITE_TITLE,
    description: OG_SITE_DESCRIPTION,
    site: '@medicusloop',
    creator: '@medicusloop',
    images: [OG_IMAGE_URL],
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
  const gtmId = gtmContainerId()

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
var d='light';
try{
  if(typeof matchMedia==='function'&&matchMedia('(prefers-color-scheme: dark)').matches){d='dark';}
}catch(e){}
try{
var t=localStorage.getItem('medicusloop-theme');
document.documentElement.setAttribute('data-theme',(t==='dark'||t==='light')?t:d);
}catch(e){
document.documentElement.setAttribute('data-theme',d);
}
})();`,
          }}
        />
        {/* CookieConsent (CMP) */}
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css"
        />
        {supabaseOrigin ? (
          <>
            <link rel="dns-prefetch" href={supabaseOrigin} />
            <link rel="preconnect" href={supabaseOrigin} crossOrigin="anonymous" />
          </>
        ) : null}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://vercel.live" />
        {/* Partage (liens du bloc public) — résolution DNS en avance, sans preconnect agressif */}
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://www.linkedin.com" />
        <link rel="dns-prefetch" href="https://www.facebook.com" />
        <link rel="dns-prefetch" href="https://twitter.com" />
        <link rel="dns-prefetch" href="https://www.instagram.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Script
          id="cookieconsent-lib"
          src="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js"
          strategy="afterInteractive"
        />
        <Script
          id="cookieconsent-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function initCc(){
  if (!window.cookieconsent || typeof window.cookieconsent.initialise !== 'function') {
    window.setTimeout(initCc, 30);
    return;
  }

  var GTM_ID = '${gtmId}';
  function loadGtm(){
    if (window.__mlGtmLoaded) return;
    window.__mlGtmLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({'gtm.start': new Date().getTime(), event:'gtm.js'});
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(GTM_ID);
    document.head.appendChild(s);
  }
  function loadVercelAnalytics(){
    if (window.__mlVercelLoaded) return;
    var host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') return;
    window.__mlVercelLoaded = true;
    var s = document.createElement('script');
    s.id = 'vercel-analytics-script';
    s.defer = true;
    s.src = '/_vercel/insights/script.js';
    document.head.appendChild(s);
  }
  function consentGranted(ctx, status){
    if (status === 'allow') return true;
    if (ctx && typeof ctx.hasConsented === 'function') return !!ctx.hasConsented();
    return false;
  }
  function applyAnalyticsConsent(ctx, status){
    if (!consentGranted(ctx, status)) return;
    loadGtm();
    loadVercelAnalytics();
  }

  window.cookieconsent.initialise({
    cookie: {
      name: 'medicusloop_cookieconsent_v1'
    },
    palette: {
      popup: { background: '#111827', text: '#f9fafb' },
      button: { background: '#10b981', text: '#0b1220' }
    },
    position: 'bottom',
    theme: 'classic',
    type: 'opt-in',
    onInitialise: function(status){
      applyAnalyticsConsent(this, status);
    },
    onStatusChange: function(status){
      applyAnalyticsConsent(this, status);
    },
    revokable: false,
    animateRevokable: false,
    content: {
      message: 'Nous utilisons des cookies pour mesurer l’audience et améliorer votre expérience.',
      dismiss: 'Refuser',
      allow: 'Accepter',
      deny: 'Refuser',
      link: 'En savoir plus',
      href: '/mentions-legales'
    }
  });
})();`,
          }}
        />
        {children}
        <div className="mobile-sticky-cta-root">
          <a
            href="/#inscription"
            className="nav-cta mobile-sticky-cta-btn"
            aria-label="Devenir Pionnier MedicusLoop — aller au formulaire"
          >
            <span className="material-symbols-outlined nav-cta__icon" aria-hidden="true">
              rocket_launch
            </span>
            <span className="nav-cta__label">Devenir pionnier</span>
          </a>
        </div>
      </body>
    </html>
  )
}
