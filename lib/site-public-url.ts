import { SHARE_PUBLIC_PAGE_URL } from '@/lib/share-public-invite'

/** URL absolue d’un fichier sous `/public` (images dans les e-mails, etc.). */
export function buildSitePublicAssetUrl(path: string): string {
  const base = getSitePublicOrigin()
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

/**
 * Origine pour liens absolus dans les e-mails (désabonnement, images).
 * Ne pas utiliser l’URL Vercel de preview : les inscrits doivent arriver sur le domaine public.
 * Définir `NEXT_PUBLIC_SITE_URL` pour forcer (ex. http://localhost:3000 en local).
 */
export function getSitePublicOrigin(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (env) return env.replace(/\/$/, '')
  return SHARE_PUBLIC_PAGE_URL.replace(/\/$/, '')
}

/** URL absolue de la page de désabonnement (jeton opaque, pas d’e-mail dans la query). */
export function buildWaitlistUnsubscribeAbsoluteUrl(unsubscribeToken: string): string {
  const base = getSitePublicOrigin()
  return `${base}/desabonnement?t=${encodeURIComponent(unsubscribeToken)}`
}
