import { Resend } from 'resend'
import type { WebhookEventPayload } from 'resend'
import { applyResendWebhookToWaitlist } from '@/lib/handle-resend-webhook'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/** Limite défensive (les payloads Resend / Svix restent petits). */
const MAX_BODY_BYTES = 512 * 1024

function resendWebhookDebug(): boolean {
  const v = process.env.RESEND_WEBHOOK_DEBUG?.trim().toLowerCase()
  return v === '1' || v === 'true' || v === 'yes'
}

/**
 * Webhooks Resend (bounce, plainte, etc.).
 *
 * Sécurité (couche principale) :
 * - **Signature Svix** : `resend.webhooks.verify` avec `RESEND_WEBHOOK_SECRET` (secret affiché une fois
 *   à la création du webhook dans Resend). Sans signature valide sur le corps **brut** + en-têtes
 *   `svix-id` / `svix-timestamp` / `svix-signature`, tout est rejeté en 400. Cela empêche forge et,
 *   avec la fenêtre temporelle Svix, limite les replays.
 * - **Secret** : ne jamais committer `RESEND_WEBHOOK_SECRET` ; le faire tourner côté Resend si fuite.
 *
 * Durcissement optionnel côté infra : WAF / rate-limit sur `/api/webhooks/*`, allowlist IP Resend
 * (liste dans la doc Resend — peut évoluer), monitoring des 400.
 *
 * Dashboard Resend : URL `https://<domaine>/api/webhooks/resend`.
 */
export function GET() {
  return new Response(null, { status: 405 })
}

export function HEAD() {
  return new Response(null, { status: 405 })
}

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET?.trim()
  if (!secret) {
    console.error('[resend-webhook] RESEND_WEBHOOK_SECRET manquant')
    return new Response('Webhook non configuré', { status: 503 })
  }

  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) {
    console.error('[resend-webhook] RESEND_API_KEY manquant (requis pour initialiser le SDK Resend)')
    return new Response('Configuration incomplète', { status: 503 })
  }

  const payload = await request.text()
  if (payload.length > MAX_BODY_BYTES) {
    return new Response('Payload trop volumineux', { status: 413 })
  }

  const id = request.headers.get('svix-id')
  const timestamp = request.headers.get('svix-timestamp')
  const signature = request.headers.get('svix-signature')

  if (!id || !timestamp || !signature) {
    return new Response('En-têtes Svix manquants', { status: 400 })
  }

  let event: WebhookEventPayload
  try {
    const resend = new Resend(apiKey)
    event = resend.webhooks.verify({
      payload,
      webhookSecret: secret,
      headers: { id, timestamp, signature },
    })
  } catch {
    return new Response('Signature invalide', { status: 400 })
  }

  const debug = resendWebhookDebug()
  if (debug) {
    console.warn('[resend-webhook] événement', { type: event.type, svixId: id })
  }

  const emailish = event.type.startsWith('email.')
  if (emailish) {
    const { handled, matchedRows } = await applyResendWebhookToWaitlist(event)
    if (debug && handled) {
      console.warn('[resend-webhook] waitlist', { matchedRows, type: event.type })
    }
  }

  return new Response(null, { status: 200 })
}
