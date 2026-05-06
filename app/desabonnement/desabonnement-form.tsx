'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { submitWaitlistEmailUnsubscribe } from './unsubscribe-actions'

type Props = {
  token: string
  email: string
}

const REASONS = [
  { value: 'trop_d_emails' as const, label: 'Je reçois trop d’e-mails' },
  { value: 'plus_interesse' as const, label: 'Je ne suis plus intéressé(e) par MedicusLoop' },
  { value: 'erreur_inscription' as const, label: 'Je ne me suis pas inscrit(e) / inscription par erreur' },
  { value: 'autre' as const, label: 'Autre (précisez ci-dessous)' },
]

export default function DesabonnementForm({ token, email }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await submitWaitlistEmailUnsubscribe(fd)
      if (res.ok) {
        router.replace('/desabonnement?ok=1')
        router.refresh()
        return
      }
      if (res.error === 'not_found') {
        setError('Ce lien n’est plus valide ou a déjà été utilisé.')
        return
      }
      setError('Une erreur est survenue. Réessayez dans quelques instants ou contactez-nous.')
    })
  }

  return (
    <form className="desabonnement-form" onSubmit={onSubmit}>
      <input type="hidden" name="token" value={token} />

      <p className="desabonnement-form__email" aria-live="polite">
        <span className="desabonnement-form__email-label">Adresse concernée</span>
        <span className="desabonnement-form__email-value">{email}</span>
      </p>

      <fieldset className="desabonnement-form__fieldset">
        <legend className="desabonnement-form__legend">Motif (obligatoire)</legend>
        <div className="desabonnement-form__radios">
          {REASONS.map((r, i) => (
            <label key={r.value} className="desabonnement-form__radio-row">
              <input
                type="radio"
                name="reason"
                value={r.value}
                required={i === 0}
                defaultChecked={r.value === 'trop_d_emails'}
              />
              <span>{r.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="desabonnement-form__details-label">
        <span className="desabonnement-form__details-caption">Précisions (optionnel)</span>
        <textarea
          name="details"
          className="desabonnement-form__textarea"
          rows={3}
          maxLength={2000}
          placeholder="Ex. contexte, suggestion…"
        />
      </label>

      {error ? <p className="desabonnement-form__error" role="alert">{error}</p> : null}

      <button type="submit" className="desabonnement-form__submit" disabled={isPending}>
        {isPending ? 'Enregistrement…' : 'Confirmer le désabonnement aux e-mails'}
      </button>
    </form>
  )
}
