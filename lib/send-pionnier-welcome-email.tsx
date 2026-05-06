import { render } from '@react-email/render'
import { Resend } from 'resend'
import { PionnierWelcomeEmail } from '@/emails/pionnier-welcome-email'
import { buildSharePageUrl } from '@/lib/share-public-invite'
import { buildWaitlistUnsubscribeAbsoluteUrl } from '@/lib/site-public-url'

/** Libellé entre guillemets : nom visible « MedicusLoop MAR », adresse inchangée. */
const DEFAULT_FROM = '"MedicusLoop MAR" <team@info.medicusloop.com>'

function resolveResendFrom(): string {
  const raw = process.env.RESEND_FROM?.trim()
  if (!raw) return DEFAULT_FROM
  if (raw.includes('<') && raw.includes('>')) return raw
  return `"MedicusLoop MAR" <${raw}>`
}

function resendDebug(): boolean {
  const v = process.env.RESEND_DEBUG?.trim().toLowerCase()
  return v === '1' || v === 'true' || v === 'yes'
}

/**
 * E-mail de confirmation après inscription à la liste d’attente MedicusLoop MAR (Resend).
 * Ne lève pas : les erreurs sont loguées ; l’inscription reste valide sans e-mail.
 */
export async function sendPionnierWelcomeEmail(params: {
  to: string
  prenom: string
  shareSourceHash: string
  unsubscribeToken: string
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const debug = resendDebug()
  if (!apiKey) {
    console.warn('[pionnier-welcome-email] skip: RESEND_API_KEY absente')
    return
  }

  const from = resolveResendFrom()
  const shareUrl = buildSharePageUrl(params.shareSourceHash)
  const unsubscribePageUrl = buildWaitlistUnsubscribeAbsoluteUrl(params.unsubscribeToken)
  const subject = 'Bienvenue sur MedicusLoop MAR'

  try {
    if (debug) {
      console.warn('[pionnier-welcome-email] envoi', {
        from,
        to: params.to,
        subject,
        shareUrlLen: shareUrl.length,
      })
    }

    const html = await render(
      <PionnierWelcomeEmail
        prenom={params.prenom}
        shareUrl={shareUrl}
        unsubscribePageUrl={unsubscribePageUrl}
      />,
    )

    const resend = new Resend(apiKey)
    const { data, error } = await resend.emails.send({
      from,
      to: params.to,
      subject,
      html,
      headers: {
        'List-Unsubscribe': `<${unsubscribePageUrl}>`,
      },
    })
    if (error) {
      console.error('[pionnier-welcome-email] Resend API error', error)
      return
    }
    console.warn('[pionnier-welcome-email] ok', { id: data?.id ?? null, to: debug ? params.to : '[masqué]' })
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e))
    console.error('[pionnier-welcome-email] exception', { name: err.name, message: err.message })
  }
}
