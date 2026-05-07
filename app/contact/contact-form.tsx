'use client'

import { useActionState } from 'react'
import { submitContactForm, type ContactFormState } from '@/app/actions'

const initialState: ContactFormState = { status: 'idle' }

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState)
  const values = state.values

  if (state.status === 'success') {
    return (
      <div className="contact-form-success scale-in" role="status" aria-live="polite">
        <span className="material-symbols-outlined contact-form-success__icon" aria-hidden="true">
          check_circle
        </span>
        <h2 className="font-fraunces ml-title-block contact-form-success__title">Message bien envoyé</h2>
        <p className="contact-form-success__text">
          Merci, nous revenons vers vous rapidement. Si besoin, vous pouvez aussi repasser par ce formulaire.
        </p>
      </div>
    )
  }

  return (
    <form className="contact-form" action={formAction} noValidate>
      <div className="contact-form__grid">
        <label className="contact-form__field">
          <span className="contact-form__label">
            Prénom <span className="contact-form__required">*</span>
          </span>
          <input
            className={`contact-form__input${state.errors?.prenom ? ' contact-form__input--error' : ''}`}
            name="prenom"
            type="text"
            defaultValue={values?.prenom ?? ''}
            autoComplete="given-name"
            required
          />
          {state.errors?.prenom ? (
            <span className="contact-form__error" role="alert">
              {state.errors.prenom}
            </span>
          ) : null}
        </label>
        <label className="contact-form__field">
          <span className="contact-form__label">
            Nom <span className="contact-form__required">*</span>
          </span>
          <input
            className={`contact-form__input${state.errors?.nom ? ' contact-form__input--error' : ''}`}
            name="nom"
            type="text"
            defaultValue={values?.nom ?? ''}
            autoComplete="family-name"
            required
          />
          {state.errors?.nom ? (
            <span className="contact-form__error" role="alert">
              {state.errors.nom}
            </span>
          ) : null}
        </label>
      </div>

      <label className="contact-form__field">
        <span className="contact-form__label">
          Email <span className="contact-form__required">*</span>
        </span>
        <input
          className={`contact-form__input${state.errors?.email ? ' contact-form__input--error' : ''}`}
          name="email"
          type="email"
          defaultValue={values?.email ?? ''}
          autoComplete="email"
          required
        />
        {state.errors?.email ? (
          <span className="contact-form__error" role="alert">
            {state.errors.email}
          </span>
        ) : null}
      </label>

      <label className="contact-form__field">
        <span className="contact-form__label">
          Sujet <span className="contact-form__required">*</span>
        </span>
        <input
          className={`contact-form__input${state.errors?.sujet ? ' contact-form__input--error' : ''}`}
          name="sujet"
          type="text"
          defaultValue={values?.sujet ?? ''}
          required
        />
        {state.errors?.sujet ? (
          <span className="contact-form__error" role="alert">
            {state.errors.sujet}
          </span>
        ) : null}
      </label>

      <label className="contact-form__field">
        <span className="contact-form__label">
          Message <span className="contact-form__required">*</span>
        </span>
        <textarea
          className={`contact-form__textarea${state.errors?.message ? ' contact-form__input--error' : ''}`}
          name="message"
          rows={7}
          defaultValue={values?.message ?? ''}
          required
        />
        {state.errors?.message ? (
          <span className="contact-form__error" role="alert">
            {state.errors.message}
          </span>
        ) : null}
      </label>

      {state.message ? (
        <p className={`contact-form__notice contact-form__notice--${state.status}`} role="status" aria-live="polite">
          {state.message}
        </p>
      ) : null}

      <button className="contact-form__submit nav-cta" type="submit" disabled={pending}>
        {pending ? 'Envoi en cours...' : 'Envoyer le message'}
      </button>
    </form>
  )
}
