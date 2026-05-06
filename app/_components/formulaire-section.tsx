'use client'

import Link from 'next/link'
import { useActionState, useEffect, useRef, useState, type ReactNode } from 'react'
import { useFormStatus } from 'react-dom'
import { PATH_CONDITIONS_GENERALES_UTILISATION } from '@/lib/legal-routes'
import {
  submitWaitlistPionnier,
  type WaitlistPionnierFormState,
} from '../actions'
import { REGIONS_FRANCE_TRIEES } from '@/lib/regions-france'
import InvitationBlock from './invitation-block'

type ProfilPionnier = 'remplacant' | 'etablissement' | 'les_deux'

function isProfilPionnierUrl(v: string | null | undefined): v is ProfilPionnier {
  return v === 'remplacant' || v === 'etablissement' || v === 'les_deux'
}

const FORM_CGU_HREF = PATH_CONDITIONS_GENERALES_UTILISATION

// ─── Submit button (reads form status) ──────────────────────────────────────

function SubmitButton({ label, loadingLabel, icon }: { label: string; loadingLabel: string; icon: string }) {
  const { pending } = useFormStatus()
  const disabled = pending
  const bg = 'var(--nav-cta-bg)'
  const border = '1px solid var(--nav-cta-border)'

  return (
    <button
      type="submit"
      disabled={disabled}
      className={`formulaire-submit${pending ? ' shimmer' : ''}`}
      style={{
        width: '100%',
        background: pending ? undefined : bg,
        color: 'var(--nav-cta-text)',
        border: pending ? '1px solid var(--border)' : border,
        borderRadius: '12px',
        padding: '14px 24px',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'filter 200ms',
        fontFamily: 'inherit',
        opacity: disabled ? 0.8 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.08)'
      }}
      onMouseLeave={(e) => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.filter = ''
      }}
      aria-label={pending ? loadingLabel : label}
    >
      {pending ? (
        loadingLabel
      ) : (
        <>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }} aria-hidden="true">
            {icon}
          </span>
          {label}
        </>
      )}
    </button>
  )
}

// ─── Success state ───────────────────────────────────────────────────────────

function successProfilBadgeLabel(profil: ProfilPionnier): string {
  if (profil === 'remplacant') return 'Pionnier · Membre MAR'
  if (profil === 'etablissement') return 'Pionnier · Partenaire établissement'
  return 'Pionnier · Les deux'
}

function SuccessState({ profil, shareSource }: { profil: ProfilPionnier; shareSource?: string }) {
  return (
    <div
      className="scale-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        padding: '48px 24px',
        textAlign: 'center',
      }}
      role="status"
      aria-live="polite"
    >
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
        <circle className="check-circle-path" cx="36" cy="36" r="31" stroke="var(--success)" strokeWidth="2" />
        <path
          className="check-mark-path"
          d="M22 36l10 10 18-20"
          stroke="var(--success)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div>
        <h3 className="font-fraunces ml-title-block" style={{ margin: '0 0 12px' }}>
          Bienvenue dans la Loop
        </h3>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            lineHeight: 1.7,
            maxWidth: '400px',
            margin: '0 auto 20px',
          }}
        >
          Votre inscription Pionnier est enregistrée. Les informations complémentaires (parcours MAR, structure,
          besoins de rempla, etc.) vous seront demandées à votre <strong>première connexion</strong> sur la
          plateforme MedicusLoop — pour garder cette étape aussi simple que possible.
        </p>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            border: '1px solid var(--accent-gold)',
            background: 'var(--accent-gold-subtle)',
            color: 'var(--accent-gold)',
            borderRadius: '9999px',
            padding: '6px 16px',
            fontSize: '0.8rem',
            fontWeight: 700,
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}
            aria-hidden="true"
          >
            verified
          </span>
          {successProfilBadgeLabel(profil)}
        </span>
      </div>

      <InvitationBlock shareSource={shareSource} />
    </div>
  )
}

// ─── Duplicate state ─────────────────────────────────────────────────────────

function DuplicateNotice() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'var(--success-notice-bg)',
        border: '1px solid var(--success-notice-border)',
        borderRadius: '12px',
        padding: '12px 16px',
        marginBottom: '20px',
      }}
      role="status"
      aria-live="polite"
    >
      <span
        className="material-symbols-outlined"
        style={{ fontSize: '18px', color: 'var(--success)', flexShrink: 0 }}
        aria-hidden="true"
      >
        check_circle
      </span>
      <span className="formulaire-form-alert" style={{ color: 'var(--success)' }}>
        Cet e-mail est déjà inscrit. Vous êtes bien dans la liste.
      </span>
    </div>
  )
}

// ─── Field wrapper ───────────────────────────────────────────────────────────

function Field({
  label,
  error,
  required,
  hint,
  children,
  id,
}: {
  label: string
  error?: string
  required?: boolean
  hint?: string
  children: React.ReactNode
  id: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label htmlFor={id} className="formulaire-field-label">
        {label}
        {required && (
          <span className="formulaire-field-required-star" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {hint && (
        <span className="formulaire-field-hint" style={{ marginTop: '-4px' }}>
          {hint}
        </span>
      )}
      <div className={error ? 'formulaire-field-control--error' : undefined}>{children}</div>
      {error && (
        <span className="formulaire-field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

// ─── Consentement (CGU + traitement des données) ─────────────────────────────

function ConsentPrivacyField({
  id,
  error,
  linkVariant,
  consentDefault,
}: {
  id: string
  error?: string
  linkVariant: 'blue' | 'violet'
  consentDefault?: boolean
}) {
  return (
    <div
      className={`formulaire-consent-wrap${error ? ' formulaire-consent-wrap--error' : ''}`}
      data-variant={linkVariant}
      style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
    >
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <input
          id={id}
          name="consent_donnees"
          type="checkbox"
          value="on"
          defaultChecked={!!consentDefault}
          className="formulaire-consent-checkbox"
          style={{
            marginTop: '4px',
            flexShrink: 0,
            width: '18px',
            height: '18px',
            cursor: 'pointer',
            accentColor: linkVariant === 'violet' ? 'var(--accent-violet)' : 'var(--nav-cta-bg)',
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-consent-error` : undefined}
        />
        <label htmlFor={id} className="formulaire-consent-label" style={{ cursor: 'pointer', margin: 0 }}>
          <span className="formulaire-consent-text">
            J&apos;ai lu les{' '}
            <Link
              href={FORM_CGU_HREF}
              prefetch={false}
              target="_blank"
              rel="noopener noreferrer"
              className="formulaire-consent-link"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              conditions générales d&apos;utilisation
            </Link>
            {' '}
            et j&apos;accepte le traitement de mes données personnelles aux fins de la prise en compte de mon
            inscription.
            <span className="formulaire-field-required-star" aria-hidden="true">
              *
            </span>
          </span>
        </label>
      </div>
      {error && (
        <span id={`${id}-consent-error`} className="formulaire-field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

/** Notes confidentialité / CNIL : uniquement avec le formulaire, pas sur l’écran de confirmation. */
function FormulaireLegalNotices({ children }: { children: ReactNode }) {
  return (
    <>
      <p className="formulaire-trust-note">
        Vos coordonnées <strong>ne sont pas partagées avec des tiers</strong>. Les données que vous saisissez sont{' '}
        <strong>traitées de façon sécurisée</strong>, uniquement pour votre inscription et nos échanges avec vous.
      </p>
      {children}
      <p className="formulaire-data-rights-note">
        Conformément à la loi «&nbsp;Informatique et Libertés&nbsp;», vous pouvez demander la{' '}
        <strong>modification</strong> ou la <strong>suppression</strong> de vos données personnelles en nous
        contactant à tout moment.
      </p>
    </>
  )
}

// ─── Formulaire unique Pionnier ──────────────────────────────────────────────

const initialWaitlistState: WaitlistPionnierFormState = { status: 'idle' }

function FormulairePionnier() {
  const [state, formAction] = useActionState(submitWaitlistPionnier, initialWaitlistState)
  const [profil, setProfil] = useState<ProfilPionnier | null>(null)

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search).get('profil')
      if (isProfilPionnierUrl(p)) setProfil(p)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    if (state.status !== 'error' && state.status !== 'duplicate') return
    const pv = state.values?.profil
    if (isProfilPionnierUrl(pv)) setProfil(pv)
    else setProfil(null)
  }, [state.status, state.draftKey, state.values?.profil])

  const v = state.values

  if (state.status === 'success') {
    return (
      <SuccessState profil={state.successProfil ?? 'remplacant'} shareSource={state.shareSource} />
    )
  }

  return (
    <FormulaireLegalNotices>
      <form
        key={`form-pionnier-${state.draftKey ?? 'pristine'}`}
        action={formAction}
        id="form-pionnier"
        noValidate
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        aria-label="Inscription programme Pionnier MedicusLoop"
      >
        {state.status === 'duplicate' && <DuplicateNotice />}

        <div className="formulaire-row-2">
          <Field label="Prénom" id="prenom" required error={state.errors?.prenom}>
            <input
              id="prenom"
              name="prenom"
              type="text"
              className="ml-input"
              required
              aria-required="true"
              autoComplete="given-name"
              defaultValue={v?.prenom ?? ''}
            />
          </Field>
          <Field label="Nom" id="nom" required error={state.errors?.nom}>
            <input
              id="nom"
              name="nom"
              type="text"
              className="ml-input"
              required
              aria-required="true"
              autoComplete="family-name"
              defaultValue={v?.nom ?? ''}
            />
          </Field>
        </div>

        <Field label="E-mail professionnel" id="email" required error={state.errors?.email}>
          <input
            id="email"
            name="email"
            type="email"
            className="ml-input"
            required
            aria-required="true"
            autoComplete="email"
            defaultValue={v?.email ?? ''}
          />
        </Field>

        <div className="formulaire-row-2">
          <Field label="Région" id="region" required error={state.errors?.region}>
            <select
              id="region"
              name="region"
              className="ml-input"
              required
              aria-required="true"
              defaultValue={v?.region ?? ''}
              aria-label="Région française"
            >
              <option value="" disabled>
                Choisir une région
              </option>
              {REGIONS_FRANCE_TRIEES.map((nom) => (
                <option key={nom} value={nom}>
                  {nom}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Ville" id="ville" error={state.errors?.ville}>
            <input
              id="ville"
              name="ville"
              type="text"
              className="ml-input"
              autoComplete="address-level2"
              defaultValue={v?.ville ?? ''}
            />
          </Field>
        </div>

        <Field label="Années d’expérience" id="annees_experience" error={state.errors?.annees_experience}>
          <select
            id="annees_experience"
            name="annees_experience"
            className="ml-input"
            defaultValue={v?.annees_experience ?? ''}
            aria-label="Tranche d’années d’expérience professionnelle"
          >
            <option value="">Je préfère ne pas préciser</option>
            <option value="moins_2">Moins de 2 ans</option>
            <option value="2_5">2 à 5 ans</option>
            <option value="6_10">6 à 10 ans</option>
            <option value="plus_10">Plus de 10 ans</option>
          </select>
        </Field>

        <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
          <legend className="formulaire-field-label" style={{ marginBottom: '8px' }}>
            Vous vous inscrivez en tant que
            <span className="formulaire-field-required-star" aria-hidden="true">
              *
            </span>
          </legend>
          <div
            className="formulaire-profil-radios"
            role="radiogroup"
            aria-label="Profil d’inscription"
            aria-required="true"
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: '12px',
                border: `1px solid ${profil === 'remplacant' ? 'var(--nav-cta-border)' : 'var(--border)'}`,
                background: profil === 'remplacant' ? 'color-mix(in srgb, var(--nav-cta-bg) 12%, var(--surface))' : 'var(--surface-2)',
                cursor: 'pointer',
                fontWeight: profil === 'remplacant' ? 600 : 500,
                fontSize: '0.875rem',
              }}
            >
              <input
                type="radio"
                name="profil"
                value="remplacant"
                checked={profil === 'remplacant'}
                onChange={() => setProfil('remplacant')}
                style={{ accentColor: 'var(--nav-cta-bg)', width: '18px', height: '18px', flexShrink: 0 }}
              />
              MAR en rempla
            </label>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: '12px',
                border: `1px solid ${profil === 'etablissement' ? 'var(--nav-cta-border)' : 'var(--border)'}`,
                background:
                  profil === 'etablissement'
                    ? 'color-mix(in srgb, var(--nav-cta-bg) 12%, var(--surface))'
                    : 'var(--surface-2)',
                cursor: 'pointer',
                fontWeight: profil === 'etablissement' ? 600 : 500,
                fontSize: '0.875rem',
              }}
            >
              <input
                type="radio"
                name="profil"
                value="etablissement"
                checked={profil === 'etablissement'}
                onChange={() => setProfil('etablissement')}
                style={{ accentColor: 'var(--nav-cta-bg)', width: '18px', height: '18px', flexShrink: 0 }}
              />
              Établissement
            </label>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: '12px',
                border: `1px solid ${profil === 'les_deux' ? 'var(--nav-cta-border)' : 'var(--border)'}`,
                background:
                  profil === 'les_deux'
                    ? 'color-mix(in srgb, var(--nav-cta-bg) 12%, var(--surface))'
                    : 'var(--surface-2)',
                cursor: 'pointer',
                fontWeight: profil === 'les_deux' ? 600 : 500,
                fontSize: '0.875rem',
              }}
            >
              <input
                type="radio"
                name="profil"
                value="les_deux"
                checked={profil === 'les_deux'}
                onChange={() => setProfil('les_deux')}
                style={{ accentColor: 'var(--nav-cta-bg)', width: '18px', height: '18px', flexShrink: 0 }}
              />
              Les deux
            </label>
          </div>
          {state.errors?.profil && (
            <span className="formulaire-field-error" role="alert" style={{ marginTop: '6px', display: 'block' }}>
              {state.errors.profil}
            </span>
          )}
        </fieldset>

        <ConsentPrivacyField
          id="consent-donnees-pionnier"
          error={state.errors?.consent_donnees}
          linkVariant="blue"
          consentDefault={v?.consent_donnees === 'on'}
        />

        {state.status === 'error' &&
          (state.message ||
            (state.errors && Object.keys(state.errors).length > 0)) && (
            <div
              className="formulaire-form-alert"
              style={{
                background: 'rgba(220, 38, 38, 0.08)',
                border: '1px solid #dc2626',
                borderRadius: '12px',
                padding: '12px 16px',
                color: 'var(--text)',
                fontSize: '0.9rem',
                lineHeight: 1.55,
              }}
              role="alert"
              aria-live="assertive"
            >
              {state.message ??
                'Merci de corriger les champs signalés ci-dessus, puis de renvoyer le formulaire.'}
            </div>
          )}

        <SubmitButton
          label="Valider mon inscription"
          loadingLabel="Inscription en cours..."
          icon="rocket_launch"
        />
      </form>
    </FormulaireLegalNotices>
  )
}

// ─── Section Formulaire principale ──────────────────────────────────────────

type FormulaireSectionProps = {
  compactSectionTop?: boolean
  /** Liste Pionniers à 50/50 : titre orienté lancement, plus « réservez votre place ». */
  listePleinePionniers?: boolean
}

export default function FormulaireSection({
  compactSectionTop = false,
  listePleinePionniers = false,
}: FormulaireSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const accentColor = 'var(--nav-cta-bg)'
  const boxShadow = '0 0 72px var(--nav-cta-pulse)'

  return (
    <section
      ref={sectionRef}
      id="inscription"
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        padding: `${compactSectionTop ? 'clamp(16px, 2.2vw, 26px)' : 'var(--ml-section-pad-top)'} var(--ml-content-inline) ${compactSectionTop ? 'clamp(20px, 3.2vw, 40px)' : 'var(--ml-section-pad-bottom)'}`,
        overflowX: 'clip',
      }}
      aria-labelledby="inscription-title"
    >
      <div
        style={{
          maxWidth: 'var(--ml-content-max)',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <header className="profils-mar-head" data-reveal>
          <h2
            id="inscription-title"
            className="font-fraunces ml-title-hero comparatif-head-title"
            style={{ margin: '0 0 16px' }}
          >
            {listePleinePionniers ? (
              <span className="comparatif-head-title__line">
                Inscrivez-vous pour être{' '}
                <span className="profils-mar-title-verb profils-mar-title-verb--rem">alerté du lancement</span>
              </span>
            ) : (
              <span className="comparatif-head-title__line">
                Réservez votre place de{' '}
                <span className="profils-mar-title-verb profils-mar-title-verb--rem">Pionnier</span>
              </span>
            )}
            <span className="pionniers-head-title__rule" aria-hidden="true" />
          </h2>
          <p className="ml-section-lead">
            Une seule inscription : <strong>identité</strong>, <strong>e-mail</strong>, <strong>région</strong>,
            éventuellement <strong>ville</strong> ou <strong>ancienneté</strong> (tranche d’expérience), et
            votre <strong>profil</strong>. Le reste — détails d’exercice,
            besoins de rempla, etc. — sera complété lors de votre{' '}
            <strong>première connexion</strong> sur la plateforme MedicusLoop.
          </p>
        </header>

        <div
          className="formulaire-card-outer"
          style={{
            margin: 'clamp(8px, 1.5vw, 16px) auto 0',
          }}
        >
          <div
            className="glass formulaire-glass"
            style={{
              borderRadius: '20px',
              padding: 'clamp(24px, 5vw, 40px)',
              border: `1px solid ${accentColor}`,
              borderColor: `color-mix(in srgb, ${accentColor} 30%, transparent)`,
              boxShadow,
              transition: 'box-shadow 300ms, border-color 300ms',
            }}
          >
            <FormulairePionnier />
          </div>
        </div>
      </div>
    </section>
  )
}
