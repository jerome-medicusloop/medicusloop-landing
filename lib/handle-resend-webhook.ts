import type { WebhookEventPayload } from 'resend'
import { createWaitlistSupabaseClient } from '@/lib/supabase-waitlist-client'

function shouldSuppressFromBounce(bounce: { type: string; subType: string; message: string }): boolean {
  const t = bounce.type.toLowerCase()
  const st = bounce.subType.toLowerCase()
  if (t === 'permanent') return true
  if (st.includes('suppress')) return true
  return false
}

function buildSuppressionReason(
  event: WebhookEventPayload,
): { reason: string; suppress: boolean } | null {
  switch (event.type) {
    case 'email.complained':
      return {
        suppress: true,
        reason: `Resend (plainte spam) — ${event.data.subject}`,
      }
    case 'email.failed':
      return {
        suppress: true,
        reason: `Resend (échec d’envoi) — ${event.data.failed.reason}`,
      }
    case 'email.bounced':
      if (!shouldSuppressFromBounce(event.data.bounce)) {
        return { suppress: false, reason: '' }
      }
      return {
        suppress: true,
        reason: `Resend (bounce) — ${event.data.bounce.type}/${event.data.bounce.subType}: ${event.data.bounce.message}`,
      }
    default:
      return null
  }
}

/**
 * Met à jour la waitlist si l’e-mail destinataire correspond : passage en unsub e-mail + motif automatique.
 * Les événements ouverts / cliqués / livrés sont ignorés.
 */
export async function applyResendWebhookToWaitlist(event: WebhookEventPayload): Promise<{
  handled: boolean
  matchedRows: number
}> {
  const plan = buildSuppressionReason(event)
  if (!plan || !plan.suppress) {
    return { handled: false, matchedRows: 0 }
  }

  const data = event.data as { to?: string[] }
  const rawTo = data.to?.[0]?.trim().toLowerCase()
  if (!rawTo) return { handled: true, matchedRows: 0 }

  const reasonLine = plan.reason.slice(0, 1800)
  const nowIso = new Date().toISOString()

  try {
    const supabase = createWaitlistSupabaseClient()
    const { data: rows, error } = await supabase
      .from('waitlist_pionniers')
      .update({
        email_communication_status: 'unsubscribed',
        unsubscribed_at: nowIso,
        unsubscribe_reason: reasonLine,
        last_modified_at: nowIso,
      })
      .eq('email', rawTo)
      .eq('email_communication_status', 'subscribed')
      .select('id')

    if (error) {
      console.error('[resend-webhook] update waitlist', { message: error.message, code: error.code })
      return { handled: true, matchedRows: 0 }
    }
    return { handled: true, matchedRows: rows?.length ?? 0 }
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e))
    console.error('[resend-webhook] exception', { message: err.message })
    return { handled: true, matchedRows: 0 }
  }
}
