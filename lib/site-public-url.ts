import { SHARE_PUBLIC_PAGE_URL } from '@/lib/share-public-invite'

/** Origine publique du site (liens absolus e-mails, désabonnement). */
export function getSitePublicOrigin(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (env) return env.replace(/\/$/, '')
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL?.trim()
  if (vercel) return `https://${vercel.replace(/\/$/, '')}`
  return SHARE_PUBLIC_PAGE_URL.replace(/\/$/, '')
}

/** URL absolue de la page de désabonnement (jeton opaque, pas d’e-mail dans la query). */
export function buildWaitlistUnsubscribeAbsoluteUrl(unsubscribeToken: string): string {
  const base = getSitePublicOrigin()
  return `${base}/desabonnement?t=${encodeURIComponent(unsubscribeToken)}`
}
