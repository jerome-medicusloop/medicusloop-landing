'use server'

import { z } from 'zod'
import { createWaitlistSupabaseClient } from '@/lib/supabase-waitlist-client'

const UnsubscribeSchema = z.object({
  token: z.string().uuid(),
  reason: z.enum(['trop_d_emails', 'plus_interesse', 'erreur_inscription', 'autre']),
  details: z.string().max(2000).optional(),
})

const REASON_LABEL: Record<z.infer<typeof UnsubscribeSchema>['reason'], string> = {
  trop_d_emails: 'Trop d’e-mails',
  plus_interesse: 'Je ne suis plus intéressé(e)',
  erreur_inscription: 'Je ne me suis pas inscrit(e) / erreur',
  autre: 'Autre',
}

export type UnsubscribeSubmitState =
  | { ok: true }
  | { ok: false; error: 'invalid' | 'db' | 'not_found' }

export async function submitWaitlistEmailUnsubscribe(formData: FormData): Promise<UnsubscribeSubmitState> {
  const raw = {
    token: formData.get('token'),
    reason: formData.get('reason'),
    details: formData.get('details'),
  }
  const parsed = UnsubscribeSchema.safeParse({
    token: typeof raw.token === 'string' ? raw.token : '',
    reason: typeof raw.reason === 'string' ? raw.reason : '',
    details:
      typeof raw.details === 'string' && raw.details.trim() !== '' ? raw.details.trim() : undefined,
  })
  if (!parsed.success) return { ok: false, error: 'invalid' }

  const reasonLine = REASON_LABEL[parsed.data.reason]
  const details = parsed.data.details?.trim()
  const unsubscribe_reason =
    details && parsed.data.reason === 'autre'
      ? `${reasonLine} — ${details}`
      : details
        ? `${reasonLine} (${details})`
        : reasonLine

  try {
    const supabase = createWaitlistSupabaseClient()
    const { data: row, error: selErr } = await supabase
      .from('waitlist_pionniers')
      .select('id, email_communication_status')
      .eq('unsubscribe_token', parsed.data.token)
      .maybeSingle()

    if (selErr || !row) return { ok: false, error: 'not_found' }

    if (row.email_communication_status === 'unsubscribed') {
      return { ok: true }
    }

    const { error: upErr } = await supabase
      .from('waitlist_pionniers')
      .update({
        email_communication_status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
        unsubscribe_reason,
        last_modified_at: new Date().toISOString(),
      })
      .eq('unsubscribe_token', parsed.data.token)
      .eq('email_communication_status', 'subscribed')

    if (upErr) return { ok: false, error: 'db' }
    return { ok: true }
  } catch {
    return { ok: false, error: 'db' }
  }
}
