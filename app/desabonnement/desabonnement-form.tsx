'use client'

import { useState } from 'react'
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

function errorMessage(code: 'invalid' | 'db' | 'not_found'): string {
  switch (code) {
    case 'not_found':
      return 'Ce lien n’est plus valide ou ne correspond à aucune inscription. Si vous avez déjà confirmé le désabonnement, vous pouvez fermer cette page.'
    case 'invalid':
      return 'Données du formulaire invalides. Vérifiez qu’un motif est bien sélectionné, puis réessayez.'
    case 'db':
      return 'Impossible d’enregistrer votre demande pour le moment. Réessayez dans quelques instants ou écrivez-nous sur hello@medicus-loop.com.'
    default:
      return 'Une erreur est survenue. Réessayez ou contactez-nous.'
  }
}

export default function DesabonnementForm({ token, email }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const fd = new FormData(form)
    setIsSubmitting(true)
    try {
      const res = await submitWaitlistEmailUnsubscribe(fd)
      if (res.ok) {
        /* Navigation pleine page : fiable après une server action (évite startTransition + async). */
        window.location.assign('/desabonnement?ok=1')
        return
      }
      setError(errorMessage(res.error))
    } catch {
      setError(errorMessage('db'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      className="desabonnement-form"
      onSubmit={onSubmit}
      aria-busy={isSubmitting}
    >
      <input type="hidden" name="token" value={token} />

      <p className="desabonnement-form__email" aria-live="polite">
        <span className="desabonnement-form__email-label">Adresse concernée</span>
        <span className="desabonnement-form__email-value">{email}</span>
      </p>

      <fieldset className="desabonnement-form__fieldset" disabled={isSubmitting}>
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
          disabled={isSubmitting}
        />
      </label>

      {error ? (
        <p className="desabonnement-form__error" role="alert" aria-live="assertive">
          {error}
        </p>
      ) : null}

      <button type="submit" className="desabonnement-form__submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enregistrement…' : 'Confirmer le désabonnement aux e-mails'}
      </button>
    </form>
  )
}
