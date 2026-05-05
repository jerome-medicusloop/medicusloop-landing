'use server'

import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { emailSourceHash } from '@/lib/share-email-source'
import { REGIONS_FRANCE } from '@/lib/regions-france'

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables')
  }
  return createClient(url, key)
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
  email: z.string().email("L'email est invalide"),
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

  try {
    const { consent_donnees: _consent, ...row } = parsed.data
    const shareSource = emailSourceHash(parsed.data.email)
    const supabase = getSupabaseClient()
    const { error } = await supabase.from('waitlist_pionniers').insert({
      ...row,
      ville: row.ville ?? null,
      region: row.region ?? null,
      annees_experience: row.annees_experience ?? null,
      validated: false,
      source: shareSource,
    })

    if (error) {
      if (error.code === '23505')
        return { status: 'duplicate', values: snap, draftKey: Date.now() }
      const base =
        'Impossible d’enregistrer votre inscription pour le moment. Réessayez dans quelques instants ou contactez-nous si le problème continue.'
      const message =
        process.env.NODE_ENV === 'development' && error.message
          ? `${base} [détail : ${error.message}]`
          : base
      return { status: 'error', message, values: snap, draftKey: Date.now() }
    }

    return { status: 'success', successProfil: parsed.data.profil, shareSource }
  } catch {
    return {
      status: 'error',
      message:
        'Impossible d’enregistrer votre inscription pour le moment. Réessayez dans quelques instants ou contactez-nous si le problème continue.',
      values: snap,
      draftKey: Date.now(),
    }
  }
}
