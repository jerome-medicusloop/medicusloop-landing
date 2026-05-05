import { createHash } from 'node:crypto'

/**
 * Identifiant de parrainage / partage : MD5 hex (32 car.) de l’e-mail normalisé.
 * À aligner avec le recalcul côté produit (trim + lowercase avant MD5).
 * Module réservé au serveur (Node `crypto`).
 */
export function emailSourceHash(email: string): string {
  return createHash('md5').update(email.trim().toLowerCase(), 'utf8').digest('hex')
}
