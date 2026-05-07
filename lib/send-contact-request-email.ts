import { Resend } from 'resend'

const DEFAULT_FROM = '"MedicusLoop Contact" <team@info.medicusloop.com>'
const DEFAULT_TO = 'hello@medicus-loop.com'

function resolveFrom(): string {
  const raw = process.env.RESEND_FROM?.trim()
  if (!raw) return DEFAULT_FROM
  if (raw.includes('<') && raw.includes('>')) return raw
  return `"MedicusLoop Contact" <${raw}>`
}

function resolveTo(): string {
  return process.env.CONTACT_FORM_TO?.trim() || DEFAULT_TO
}

export async function sendContactRequestEmail(params: {
  prenom: string
  nom: string
  email: string
  sujet: string
  message: string
}): Promise<{ ok: true } | { ok: false; reason: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) return { ok: false, reason: 'RESEND_API_KEY absente' }

  try {
    const resend = new Resend(apiKey)
    const fullName = `${params.prenom} ${params.nom}`.trim()
    const escapedName = escapeHtml(fullName)
    const escapedEmail = escapeHtml(params.email)
    const escapedSujet = escapeHtml(params.sujet)
    const escapedMessage = escapeHtml(params.message).replace(/\n/g, '<br />')

    const html = `
<!doctype html>
<html lang="fr">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nouveau message de contact — MedicusLoop</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f4f6;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="width:640px;max-width:92%;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;">
            <tr>
              <td style="padding:26px 24px 20px;font-family:Arial,Helvetica,sans-serif;color:#111827;">
                <h1 style="margin:0 0 18px;font-size:30px;line-height:1.2;font-weight:700;color:#111827;">Nouveau message de contact — MedicusLoop</h1>

                <p style="margin:0 0 12px;font-size:16px;line-height:1.5;color:#111827;"><strong>Nom :</strong> ${escapedName}</p>
                <p style="margin:0 0 12px;font-size:16px;line-height:1.5;color:#111827;"><strong>Email :</strong> ${escapedEmail}</p>
                <p style="margin:0 0 16px;font-size:16px;line-height:1.5;color:#111827;"><strong>Sujet :</strong> ${escapedSujet}</p>

                <p style="margin:0 0 8px;font-size:16px;line-height:1.5;color:#111827;"><strong>Message :</strong></p>
                <div style="font-size:16px;line-height:1.6;color:#111827;word-break:break-word;">${escapedMessage}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `.trim()
    const text = [
      'Nouveau message de contact — MedicusLoop',
      '',
      `Nom : ${fullName}`,
      `Email : ${params.email}`,
      `Sujet : ${params.sujet}`,
      '',
      'Message :',
      params.message,
    ].join('\n')

    const { error } = await resend.emails.send({
      from: resolveFrom(),
      to: resolveTo(),
      subject: `[Contact landing] ${params.sujet}`,
      replyTo: params.email,
      html,
      text,
    })

    if (error) return { ok: false, reason: error.message || 'Erreur Resend' }
    return { ok: true }
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e))
    return { ok: false, reason: err.message }
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
