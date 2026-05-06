import {
  buildShareInviteDeepLink,
  SHARE_PUBLIC_MESSAGES,
} from '@/lib/share-public-invite'

export type PionnierWelcomeEmailProps = {
  prenom: string
  /** Lien site avec `?source=` pour le parrainage. */
  shareUrl: string
  /** Page désabonnement (jeton opaque, pas d’e-mail dans l’URL). */
  unsubscribePageUrl: string
}

const C_PRIMARY = '#10B981'
const C_PRIMARY_DARK = '#059669'
const C_TEXT = '#0f172a'
const C_MUTED = '#64748b'
const C_BG = '#f8fafc'
const C_CARD = '#ffffff'
const C_BORDER = '#e2e8f0'

/**
 * E-mail transactionnel HTML (styles inline — compat clients mail).
 */
export function PionnierWelcomeEmail({ prenom, shareUrl, unsubscribePageUrl }: PionnierWelcomeEmailProps) {
  const prenomTitre = prenom.trim() || 'cher confrère'
  const msg = SHARE_PUBLIC_MESSAGES
  const shareWa = buildShareInviteDeepLink('whatsapp', shareUrl, msg)
  const shareMail = buildShareInviteDeepLink('email', shareUrl, msg)
  const shareLi = buildShareInviteDeepLink('linkedin', shareUrl, msg)
  const shareFb = buildShareInviteDeepLink('facebook', shareUrl, msg)
  const shareX = buildShareInviteDeepLink('twitter', shareUrl, msg)
  const platformLinkStyle = {
    color: C_PRIMARY_DARK,
    fontWeight: 700 as const,
    fontSize: '15px' as const,
    textDecoration: 'underline' as const,
  }

  return (
    <div
      style={{
        margin: 0,
        padding: '32px 16px',
        backgroundColor: C_BG,
        fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        color: C_TEXT,
        fontSize: '16px',
        lineHeight: 1.6,
      }}
    >
      <table
        role="presentation"
        cellPadding={0}
        cellSpacing={0}
        style={{ width: '100%', maxWidth: '560px', margin: '0 auto' }}
      >
        <tbody>
          <tr>
            <td
              style={{
                background: `linear-gradient(135deg, ${C_PRIMARY} 0%, ${C_PRIMARY_DARK} 100%)`,
                borderRadius: '12px 12px 0 0',
                padding: '24px 28px',
                color: '#ffffff',
              }}
            >
              <p style={{ margin: 0, fontSize: '13px', letterSpacing: '0.06em', opacity: 0.95 }}>
                MEDICUSLOOP · MAR
              </p>
              <h1
                style={{
                  margin: '10px 0 0',
                  fontSize: '24px',
                  fontWeight: 700,
                  lineHeight: 1.25,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                }}
              >
                Bienvenue sur MedicusLoop MAR
              </h1>
            </td>
          </tr>
          <tr>
            <td
              style={{
                backgroundColor: C_CARD,
                border: `1px solid ${C_BORDER}`,
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
                padding: '28px 28px 32px',
              }}
            >
              <p style={{ margin: '0 0 16px' }}>Bonjour {prenomTitre},</p>
              <p style={{ margin: '0 0 16px', color: C_MUTED }}>
                Votre inscription à MedicusLoop est bien enregistrée. Nous vous contacterons{' '}
                <strong style={{ color: C_TEXT }}>très prochainement</strong> pour la date d’ouverture officielle de
                la plateforme MAR — et la suite du parcours avec vous.
              </p>
              <p style={{ margin: '0 0 24px', color: C_MUTED }}>
                Conservez ce message : il confirme votre inscription et pourra vous servir de référence pour le
                parrainage ci-dessous.
              </p>

              <table
                role="presentation"
                cellPadding={0}
                cellSpacing={0}
                style={{
                  width: '100%',
                  backgroundColor: '#ecfdf5',
                  border: `1px solid ${C_PRIMARY}`,
                  borderRadius: '10px',
                  marginBottom: '24px',
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ padding: '20px 22px' }}>
                      <p
                        style={{
                          margin: '0 0 8px',
                          fontSize: '14px',
                          fontWeight: 700,
                          color: C_PRIMARY_DARK,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        Parrainage — invitez vos confrères
                      </p>
                      <p style={{ margin: '0 0 10px', fontSize: '15px', color: C_TEXT }}>
                        Le parrainage récompense celles et ceux qui font grandir le réseau :{' '}
                        <strong>avantages exclusifs</strong> à l’ouverture, <strong>boost de visibilité</strong> pour vos
                        annonces, <strong>priorité sur la première mise en relation</strong>.
                      </p>
                      <p style={{ margin: '0 0 18px', fontSize: '15px', color: C_TEXT }}>
                        Partagez MedicusLoop : chaque inscription via{' '}
                        <strong>votre lien personnel</strong> relie le réseau à votre profil, sans exposer votre
                        e-mail.
                      </p>
                      <p
                        style={{
                          margin: '0 0 12px',
                          fontSize: '13px',
                          fontWeight: 800,
                          color: C_PRIMARY_DARK,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}
                      >
                        Partager sur les plateformes
                      </p>
                      <p
                        style={{
                          margin: '0 0 22px',
                          fontSize: '15px',
                          lineHeight: 2,
                          color: C_TEXT,
                        }}
                      >
                        <a href={shareWa} target="_blank" rel="noopener noreferrer" style={platformLinkStyle}>
                          WhatsApp
                        </a>
                        <span style={{ color: C_BORDER, padding: '0 8px' }} aria-hidden="true">
                          |
                        </span>
                        <a href={shareMail} style={platformLinkStyle}>
                          E-mail
                        </a>
                        <span style={{ color: C_BORDER, padding: '0 8px' }} aria-hidden="true">
                          |
                        </span>
                        <a href={shareLi} target="_blank" rel="noopener noreferrer" style={platformLinkStyle}>
                          LinkedIn
                        </a>
                        <span style={{ color: C_BORDER, padding: '0 8px' }} aria-hidden="true">
                          |
                        </span>
                        <a href={shareFb} target="_blank" rel="noopener noreferrer" style={platformLinkStyle}>
                          Facebook
                        </a>
                        <span style={{ color: C_BORDER, padding: '0 8px' }} aria-hidden="true">
                          |
                        </span>
                        <a href={shareX} target="_blank" rel="noopener noreferrer" style={platformLinkStyle}>
                          X
                        </a>
                      </p>
                      <a
                        href={shareUrl}
                        style={{
                          display: 'inline-block',
                          padding: '12px 22px',
                          backgroundColor: C_PRIMARY,
                          color: '#ffffff',
                          textDecoration: 'none',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '15px',
                        }}
                      >
                        Ouvrir le lien de partage
                      </a>
                      <p
                        style={{
                          margin: '14px 0 0',
                          fontSize: '12px',
                          color: C_MUTED,
                          wordBreak: 'break-all',
                        }}
                      >
                        {shareUrl}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>

              <p style={{ margin: 0, fontSize: '14px', color: C_MUTED }}>
                Une question ? Répondez à ce message ou écrivez-nous sur{' '}
                <a href="mailto:hello@medicus-loop.com" style={{ color: C_PRIMARY_DARK, fontWeight: 600 }}>
                  hello@medicus-loop.com
                </a>
                .
              </p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '20px 8px 0', textAlign: 'center', fontSize: '12px', color: C_MUTED }}>
              <p style={{ margin: '0 0 8px' }}>MedicusLoop — MAR & établissements de santé</p>
              <p style={{ margin: '0 0 10px', lineHeight: 1.55 }}>
                Vous recevez cet e-mail automatiquement suite à votre inscription sur la liste d’attente MedicusLoop. Si
                vous ne souhaitez plus recevoir d’e-mails d’information de notre part, vous pouvez vous désabonner en
                un clic — lien personnel, ne le partagez pas :
              </p>
              <p style={{ margin: 0, lineHeight: 1.5 }}>
                <a
                  href={unsubscribePageUrl}
                  style={{ color: C_PRIMARY_DARK, fontWeight: 700, textDecoration: 'underline' }}
                >
                  Gérer mon abonnement aux e-mails MedicusLoop
                </a>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
