/** Lien public MedicusLoop : invitation entre confrères (hors parrainage inscrit). */
export const SHARE_PUBLIC_PAGE_URL = 'https://medicus-loop.com'

/** Ajoute `?source=` (ou `&source=`) si un hash MD5 hex (32 car.) est fourni ; sinon lien public seul. */
export function buildSharePageUrl(sourceHash?: string | null): string {
  const base = SHARE_PUBLIC_PAGE_URL.replace(/\/$/, '')
  const s = sourceHash?.trim()
  if (!s) return base
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}source=${encodeURIComponent(s)}`
}

/** Identifiants des canaux pour messages / URLs de partage. */
export type ShareInviteChannelId =
  | 'whatsapp'
  | 'sms'
  | 'email'
  | 'linkedin'
  | 'facebook'
  | 'twitter'
  | 'copy'

/**
 * Textes publics adaptés au canal (longueur, ton, audience).
 * LinkedIn n’embarque que l’URL dans l’URL native ; le texte sert à cohérence / presse-papiers éventuel.
 */
export const SHARE_PUBLIC_MESSAGES = {
  whatsapp:
    'Confrère, je te glisse ça avant tout le monde : MedicusLoop MAR refait le lien remplaçant et établissement — va t\'inscrire pour tes prochaines recherches de remplaçant, ou inscris ton établissement si tu veux recruter un MAR ou déclarer un besoin (même parcours sur le site). À voir :',

  sms:
    'Info MAR confrères : MedicusLoop — plateforme qui matche vraiment praticiens & établissements pour les remplas. Lien :',

  email:
    'Bonjour,\n\nJe souhaite partager MedicusLoop : un projet qui repositionne les MAR autour du temps médical — mise en relation ciblée, parcours plus court entre professionnels de santé et structures.\n\nLien à consulter :',

  linkedin:
    'Côté mobilité MAR : MedicusLoop rapproche remplaçants et structures — forfait clair, contrat avec signature électronique, vérification CNOM. Pour directions médicales, RH et praticiens qui veulent sécuriser les missions. Détails :',

  facebook:
    'Pour le réseau confrères : MedicusLoop arrive pour fluidifier les MAR — mise en relation fiable, moins de friction. Si tu connais des équipes ou des praticiens concernés, fais suivre :',

  twitter:
    'MAR : MedicusLoop simplifie les remplacements entre remplaçants et structures — matching clair, parcours plus court. Les pros de santé peuvent anticiper ici :',

  copy:
    'MedicusLoop — plateforme MAR nouvelle génération : matching transparent, moins de perte de temps entre praticiens et établissements. À partager entre confrères :',
} as const satisfies Record<ShareInviteChannelId, string>

/** Compat : fallback si un composant n’envoie pas `messagesByChannel`. */
export const SHARE_PUBLIC_MESSAGE = SHARE_PUBLIC_MESSAGES.whatsapp

export const SHARE_PUBLIC_EMAIL_SUBJECT = 'MedicusLoop — à faire découvrir entre confrères (MAR)'
