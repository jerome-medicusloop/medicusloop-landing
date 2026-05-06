'use client'

import { useEffect, useState } from 'react'

const DOMAIN_CHARS = [109, 101, 100, 105, 99, 117, 115, 45, 108, 111, 111, 112, 46, 99, 111, 109]

function domainFromChars(): string {
  return DOMAIN_CHARS.map((c) => String.fromCharCode(c)).join('')
}

/** Recompose l’adresse côté client uniquement (pas de `mailto:` ni d’e-mail en clair dans le HTML statique). */
function emailFromLocal(localAscii: number[]): string {
  const local = localAscii.map((c) => String.fromCharCode(c)).join('')
  return `${local}@${domainFromChars()}`
}

const HELLO_LOCAL = [104, 101, 108, 108, 111]
const DPO_LOCAL = [100, 112, 111]

type MentionsLegalesContactMailProps = {
  className?: string
  /** `hello` : contact général ; `dpo` : délégué à la protection des données. */
  variant?: 'hello' | 'dpo'
  /** Dans un paragraphe (pas d’icône, style lien souligné). */
  inline?: boolean
}

function obfuscatedLocalLabel(variant: 'hello' | 'dpo') {
  const local = variant === 'hello' ? 'hello' : 'dpo'
  return (
    <>
      {local} <span aria-hidden="true">[</span>at<span aria-hidden="true">]</span> medicus-loop.com
    </>
  )
}

/**
 * Limite le moissonnage automatique : avant hydratation, texte dégradé mais lisible pour les humains
 * (et obligations de contact sans exécution JS). Après chargement : lien mailto habituel.
 */
export default function MentionsLegalesContactMail({
  className,
  variant = 'hello',
  inline = false,
}: MentionsLegalesContactMailProps) {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  const localChars = variant === 'hello' ? HELLO_LOCAL : DPO_LOCAL
  const email = emailFromLocal(localChars)

  const rootClass = [
    inline ? 'mentions-legales-inline-mailto' : 'mentions-legales-mail',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const obfuscatedSuffix = inline
    ? 'mentions-legales-inline-mailto--obfuscated'
    : 'mentions-legales-mail--obfuscated'

  if (!hydrated) {
    return (
      <span
        className={[rootClass, obfuscatedSuffix].filter(Boolean).join(' ')}
        title="Lien e-mail disponible une fois la page chargée"
      >
        {!inline ? (
          <>
            <span className="material-symbols-outlined mentions-legales-mail-icon" aria-hidden="true">
              mail
            </span>
            <span>{obfuscatedLocalLabel(variant)}</span>
          </>
        ) : (
          obfuscatedLocalLabel(variant)
        )}
      </span>
    )
  }

  return (
    <a
      href={`mailto:${email}`}
      className={rootClass}
      aria-label={`Envoyer un e-mail à ${email}`}
    >
      {!inline ? (
        <>
          <span className="material-symbols-outlined mentions-legales-mail-icon" aria-hidden="true">
            mail
          </span>
          {email}
        </>
      ) : (
        email
      )}
    </a>
  )
}
