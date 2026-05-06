import type { Metadata } from 'next'

export const SITE_URL = 'https://medicus-loop.com' as const

/** Titre onglet + Open Graph + Twitter — aligné wording partage (pas de « clinique privée »). */
export const OG_SITE_TITLE = 'MedicusLoop · Remplacement MAR — matching, contrat et LoopExpérience'

export const OG_SITE_DESCRIPTION =
  'MedicusLoop met en relation MAR et établissements de santé : matching clair, forfait journalier explicite, contrat avec signature électronique, vérification CNOM. Moins de friction administrative, plus de temps pour le soin.'

export const OG_IMAGE_PATH = '/og-image.png' as const

export const OG_IMAGE_ALT = 'MedicusLoop — Remplacement MAR, contrat et LoopExpérience'

/** Métadonnées complètes pour la page d’accueil (`/`) : renforce og:* sur l’URL canonique. */
export function homeMetadata(): Metadata {
  return {
    title: OG_SITE_TITLE,
    description: OG_SITE_DESCRIPTION,
    alternates: { canonical: SITE_URL },
    openGraph: {
      title: OG_SITE_TITLE,
      description: OG_SITE_DESCRIPTION,
      url: SITE_URL,
      siteName: 'MedicusLoop',
      locale: 'fr_FR',
      type: 'website',
      images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630, alt: OG_IMAGE_ALT }],
    },
    twitter: {
      card: 'summary_large_image',
      title: OG_SITE_TITLE,
      description: OG_SITE_DESCRIPTION,
      site: '@medicusloop',
      creator: '@medicusloop',
      images: [OG_IMAGE_PATH],
    },
  }
}
