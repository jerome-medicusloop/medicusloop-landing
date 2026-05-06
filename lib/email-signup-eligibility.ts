import dns from 'node:dns/promises'
import disposableDomains from 'disposable-email-domains'

/** Liste maintenue (npm / GitHub ivolo/disposable-email-domains). */
const disposableSet = new Set((disposableDomains as string[]).map((d) => d.toLowerCase()))

const RETRYABLE_DNS_CODES = new Set(['ESERVFAIL', 'ETIMEOUT', 'ECONNREFUSED', 'ENETUNREACH'])

export const DISPOSABLE_EMAIL_USER_MESSAGE =
  'Les adresses e-mail temporaires ou jetables ne sont pas acceptées. Merci d’utiliser une adresse personnelle ou professionnelle que vous consultez régulièrement.'

export const INVALID_EMAIL_DOMAIN_USER_MESSAGE =
  'Ce domaine e-mail semble invalide ou incapable de recevoir des messages. Vérifiez l’orthographe après @ ou essayez une autre adresse.'

export function getEmailDomain(email: string): string | null {
  const normalized = email.trim().toLowerCase()
  const at = normalized.lastIndexOf('@')
  if (at < 1 || at === normalized.length - 1) return null
  return normalized.slice(at + 1)
}

/** Correspondance exacte ou suffixe (ex. sous-domaine d’un fournisseur jetable). */
export function isDisposableEmailDomain(domain: string): boolean {
  const parts = domain.toLowerCase().split('.').filter(Boolean)
  if (parts.length < 2) return false
  for (let i = 0; i < parts.length - 1; i++) {
    if (disposableSet.has(parts.slice(i).join('.'))) return true
  }
  return false
}

/**
 * Indique si le domaine peut raisonnablement recevoir du SMTP (MX ou fallback A/AAAA).
 * En cas d’erreur DNS « transitoire », on laisse passer pour ne pas bloquer les inscriptions.
 */
export async function domainLikelyAcceptsMail(domain: string): Promise<boolean> {
  let mxRecords: Awaited<ReturnType<typeof dns.resolveMx>> | null = null
  try {
    mxRecords = await dns.resolveMx(domain)
  } catch (e) {
    const code = (e as NodeJS.ErrnoException).code
    if (code && RETRYABLE_DNS_CODES.has(code)) return true
    mxRecords = null
  }

  if (mxRecords && mxRecords.length > 0) return true

  try {
    const a = await dns.resolve4(domain)
    if (a.length > 0) return true
  } catch (e) {
    const code = (e as NodeJS.ErrnoException).code
    if (code && RETRYABLE_DNS_CODES.has(code)) return true
  }

  try {
    const aaaa = await dns.resolve6(domain)
    if (aaaa.length > 0) return true
  } catch (e) {
    const code = (e as NodeJS.ErrnoException).code
    if (code && RETRYABLE_DNS_CODES.has(code)) return true
  }

  return false
}
