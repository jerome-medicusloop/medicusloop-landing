'use server'

import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { sendPionnierWelcomeEmail } from '@/lib/send-pionnier-welcome-email'
import { emailSourceHash } from '@/lib/share-email-source'
import { REGIONS_FRANCE } from '@/lib/regions-france'
import {
  DISPOSABLE_EMAIL_USER_MESSAGE,
  domainLikelyAcceptsMail,
  getEmailDomain,
  INVALID_EMAIL_DOMAIN_USER_MESSAGE,
  isDisposableEmailDomain,
} from '@/lib/email-signup-eligibility'
import { createWaitlistSupabaseClient } from '@/lib/supabase-waitlist-client'

/** Logs détaillés + message d’erreur UI enrichi (définir à `1` ou `true` sur Vercel le temps du debug). */
function waitlistSupabaseDebug(): boolean {
  const v = process.env.LANDING_FORM_DEBUG_SUPABASE?.trim().toLowerCase()
  return v === '1' || v === 'true' || v === 'yes'
}

function supabaseInsertLogPayload(err: { message?: string; code?: string; details?: string; hint?: string }) {
  return {
    code: err.code ?? null,
    message: err.message ?? null,
    details: err.details ?? null,
    hint: err.hint ?? null,
  }
}

// ─── Waitlist Pionnier (landing : inscription minimale) ─────────────────────

const optionalTrimmed = (max: number, label: string) =>
  z.preprocess(
    (v) => {
      if (v == null || v === '') return undefined
      const s = String(v).trim()
      return s === '' ? undefined : s
    },
    z.string().max(max, `${label} est trop long`).optional()
  )

const WaitlistPionnierSchema = z.object({
  prenom: z.string().min(1, 'Le prénom est requis').max(100),
  nom: z.string().min(1, 'Le nom est requis').max(100),
  email: z
    .string()
    .transform((s) => s.trim().toLowerCase())
    .pipe(z.string().email("L'email est invalide")),
  ville: optionalTrimmed(120, 'La ville'),
  region: z.preprocess(
    (v) => (v == null || v === '' ? '' : String(v)),
    z
      .string()
      .min(1, 'La région est requise.')
      .pipe(z.enum(REGIONS_FRANCE, { message: 'Veuillez choisir une région dans la liste.' }))
  ),
  annees_experience: z.preprocess(
    (v) => (v == null || v === '' ? undefined : v),
    z
      .enum(['moins_2', '2_5', '6_10', 'plus_10'], {
        message: 'Veuillez choisir une tranche d’expérience valide.',
      })
      .optional()
  ),
  profil: z.preprocess(
    (v) => (v == null || v === '' ? '' : String(v)),
    z
      .string()
      .min(1, 'Veuillez choisir un profil.')
      .pipe(z.enum(['remplacant', 'etablissement', 'les_deux'], { message: 'Profil non reconnu.' }))
  ),
  consent_donnees: z
    .unknown()
    .refine((val): val is 'on' => val === 'on', {
      message:
        'Veuillez cocher la case pour confirmer votre lecture des conditions générales d’utilisation et votre acceptation du traitement de vos données.',
    }),
})

export type WaitlistPionnierFormValues = {
  prenom: string
  nom: string
  email: string
  ville: string
  region: string
  annees_experience: string
  profil: string
  consent_donnees: '' | 'on'
}

export type WaitlistPionnierFormState = {
  status: 'idle' | 'success' | 'error' | 'duplicate'
  message?: string
  errors?: Partial<Record<keyof z.infer<typeof WaitlistPionnierSchema>, string>>
  values?: WaitlistPionnierFormValues
  /** Profil enregistré (affichage succès). */
  successProfil?: 'remplacant' | 'etablissement' | 'les_deux'
  /** MD5 hex de l’e-mail (même valeur que colonne `source`) pour liens `?source=` après inscription. */
  shareSource?: string
  draftKey?: number
}

function snapshotWaitlistPionnierForm(formData: FormData): WaitlistPionnierFormValues {
  return {
    prenom: String(formData.get('prenom') ?? ''),
    nom: String(formData.get('nom') ?? ''),
    email: String(formData.get('email') ?? ''),
    ville: String(formData.get('ville') ?? ''),
    region: String(formData.get('region') ?? ''),
    annees_experience: String(formData.get('annees_experience') ?? ''),
    profil: String(formData.get('profil') ?? ''),
    consent_donnees: formData.get('consent_donnees') === 'on' ? 'on' : '',
  }
}

export async function submitWaitlistPionnier(
  _prev: WaitlistPionnierFormState,
  formData: FormData
): Promise<WaitlistPionnierFormState> {
  const raw = {
    prenom: formData.get('prenom'),
    nom: formData.get('nom'),
    email: formData.get('email'),
    ville: formData.get('ville'),
    region: formData.get('region'),
    annees_experience: formData.get('annees_experience'),
    profil: formData.get('profil'),
    consent_donnees: formData.get('consent_donnees'),
  }

  const snap = snapshotWaitlistPionnierForm(formData)
  const parsed = WaitlistPionnierSchema.safeParse(raw)

  if (!parsed.success) {
    const fieldErrors: WaitlistPionnierFormState['errors'] = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof z.infer<typeof WaitlistPionnierSchema>
      if (!(field in fieldErrors)) {
        fieldErrors[field] = issue.message
      }
    }
    return { status: 'error', errors: fieldErrors, values: snap, draftKey: Date.now() }
  }

  const emailKey = parsed.data.email
  const emailHost = getEmailDomain(emailKey)
  if (emailHost && isDisposableEmailDomain(emailHost)) {
    return {
      status: 'error',
      errors: { email: DISPOSABLE_EMAIL_USER_MESSAGE },
      values: snap,
      draftKey: Date.now(),
    }
  }
  if (emailHost && !(await domainLikelyAcceptsMail(emailHost))) {
    return {
      status: 'error',
      errors: { email: INVALID_EMAIL_DOMAIN_USER_MESSAGE },
      values: snap,
      draftKey: Date.now(),
    }
  }

  const debug = waitlistSupabaseDebug()

  try {
    const { consent_donnees: _consent, ...row } = parsed.data
    const shareSource = emailSourceHash(emailKey)
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const usingServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim())
    if (debug) {
      let host: string | null = null
      try {
        host = url ? new URL(url).host : null
      } catch {
        host = null
      }
      console.warn('[waitlist-pionnier] tentative insert', {
        host,
        keyMode: usingServiceRole ? 'service_role' : 'anon_fallback',
      })
    }

    const supabase = createWaitlistSupabaseClient()
    const nowIso = new Date().toISOString()
    const unsubscribeToken = randomUUID()

    const { data: existing, error: selErr } = await supabase
      .from('waitlist_pionniers')
      .select('id, email_communication_status')
      .eq('email', emailKey)
      .maybeSingle()

    if (selErr) {
      console.error('[waitlist-pionnier] select existant', supabaseInsertLogPayload(selErr))
      const base =
        'Impossible d’enregistrer votre inscription pour le moment. Réessayez dans quelques instants ou contactez-nous si le problème continue.'
      const message =
        debug && selErr.message ? `${base} [select: ${selErr.message}]` : base
      return { status: 'error', message, values: snap, draftKey: Date.now() }
    }

    if (existing?.email_communication_status === 'subscribed') {
      return { status: 'duplicate', values: snap, draftKey: Date.now() }
    }

    /* Déjà en base mais désabonné e-mail : réactiver (sub), nouveau jeton + last_modified, renvoyer le mail. */
    if (existing && existing.email_communication_status === 'unsubscribed') {
      const reactivatedAt = new Date().toISOString()
      const { error: upErr } = await supabase
        .from('waitlist_pionniers')
        .update({
          prenom: row.prenom,
          nom: row.nom,
          email: emailKey,
          ville: row.ville ?? null,
          region: row.region ?? null,
          annees_experience: row.annees_experience ?? null,
          profil: row.profil,
          validated: false,
          source: shareSource,
          email_communication_status: 'subscribed',
          unsubscribed_at: null,
          unsubscribe_reason: null,
          unsubscribe_token: unsubscribeToken,
          last_modified_at: reactivatedAt,
        })
        .eq('id', existing.id)

      if (upErr) {
        console.error('[waitlist-pionnier] update réabonnement', supabaseInsertLogPayload(upErr))
        const base =
          'Impossible d’enregistrer votre inscription pour le moment. Réessayez dans quelques instants ou contactez-nous si le problème continue.'
        const message =
          debug && upErr.message ? `${base} [update: ${upErr.message}]` : base
        return { status: 'error', message, values: snap, draftKey: Date.now() }
      }

      if (debug) {
        console.warn('[waitlist-pionnier] réabonnement e-mail OK', { id: existing.id })
      }

      await sendPionnierWelcomeEmail({
        to: emailKey,
        prenom: parsed.data.prenom,
        shareSourceHash: shareSource,
        unsubscribeToken,
      })

      return { status: 'success', successProfil: parsed.data.profil, shareSource }
    }

    const { error } = await supabase.from('waitlist_pionniers').insert({
      ...row,
      email: emailKey,
      ville: row.ville ?? null,
      region: row.region ?? null,
      annees_experience: row.annees_experience ?? null,
      validated: false,
      source: shareSource,
      unsubscribe_token: unsubscribeToken,
      email_communication_status: 'subscribed',
      register_date: nowIso,
      last_modified_at: nowIso,
    })

    if (error) {
      console.error('[waitlist-pionnier] insert Supabase', supabaseInsertLogPayload(error))
      if (error.code === '23505')
        return { status: 'duplicate', values: snap, draftKey: Date.now() }
      const base =
        'Impossible d’enregistrer votre inscription pour le moment. Réessayez dans quelques instants ou contactez-nous si le problème continue.'
      const showDetail =
        (process.env.NODE_ENV === 'development' || debug) && Boolean(error.message)
      const message = showDetail
        ? `${base} [${error.code ?? 'sans-code'}: ${error.message}${error.hint ? ` — hint: ${error.hint}` : ''}]`
        : base
      return { status: 'error', message, values: snap, draftKey: Date.now() }
    }

    if (debug) {
      console.warn('[waitlist-pionnier] insert OK (sans ligne retournée — vérifier la table)')
    }

    await sendPionnierWelcomeEmail({
      to: emailKey,
      prenom: parsed.data.prenom,
      shareSourceHash: shareSource,
      unsubscribeToken,
    })

    return { status: 'success', successProfil: parsed.data.profil, shareSource }
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e))
    console.error('[waitlist-pionnier] exception', { name: err.name, message: err.message, stack: err.stack })
    const base =
      'Impossible d’enregistrer votre inscription pour le moment. Réessayez dans quelques instants ou contactez-nous si le problème continue.'
    const message =
      debug && err.message ? `${base} [exception: ${err.message}]` : base
    return {
      status: 'error',
      message,
      values: snap,
      draftKey: Date.now(),
    }
  }
}
