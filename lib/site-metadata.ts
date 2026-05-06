import type { Metadata } from 'next'

export const SITE_URL = 'https://medicus-loop.com' as const

/** Titre onglet + Open Graph + Twitter — aligné wording partage (pas de « clinique privée »). */
export const OG_SITE_TITLE = 'MedicusLoop · Remplacement MAR — matching, contrat et LoopExpérience'

export const OG_SITE_DESCRIPTION =
  'MedicusLoop met en relation MAR et établissements de santé : matching clair, forfait journalier explicite, contrat avec signature électronique, vérification CNOM. Moins de friction administrative, plus de temps pour le soin.'

/** Fichier produit par `npm run compress:public` (JPEG 2400×1260 — LinkedIn / RS downscales plus net que du 1200 upscalé). */
export const OG_IMAGE_PATH = '/og-image.jpg' as const

/** URL absolue — LinkedIn / scrapers après redirect www → apex exigent souvent une URL complète. */
export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}` as const

export const OG_IMAGE_ALT = 'MedicusLoop — Remplacement MAR, contrat et LoopExpérience'

/**
 * Métadonnées spécifiques à la page d’accueil.
 * `openGraph` / `twitter` / images OG sont définis une seule fois dans `app/layout.tsx` pour éviter
 * qu’un merge partiel n’écrase `og:image` (ex. LinkedIn « No image found »).
 */
export function homeMetadata(): Metadata {
  return {
    title: OG_SITE_TITLE,
    description: OG_SITE_DESCRIPTION,
    alternates: { canonical: SITE_URL },
  }
}
