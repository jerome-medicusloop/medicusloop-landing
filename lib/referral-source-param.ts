/**
 * Valeur attendue pour `?source=` : MD5 hex sur 32 caractères minuscules (même format que le hash d’e-mail côté app).
 * Côté client ou serveur (pas de dépendance Node).
 */
export function parseReferralSourceParam(raw: string | null | undefined): string | null {
  if (raw == null) return null
  const s = String(raw).trim().toLowerCase()
  if (s.length !== 32 || !/^[a-f0-9]{32}$/.test(s)) return null
  return s
}
