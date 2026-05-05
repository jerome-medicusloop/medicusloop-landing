'use client'

import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { IconFacebook, IconInstagram, IconLinkedIn, IconTikTok, IconWhatsApp } from './share-channel-icons'

const DEFAULT_PAGE_URL = 'https://medicus-loop.com'

export type ShareInviteChannelsProps = {
  /** Texte inclus dans WhatsApp / SMS / corps d’e-mail avant l’URL. */
  message: string
  emailSubject: string
  pageUrl?: string
  title?: ReactNode
  subtitle?: ReactNode
  footnote?: ReactNode
  /** Intégration dans une carte (ex. compteur liste pleine) : marges plus serrées. */
  embed?: boolean
  /** Faux quand le bloc est déjà isolé dans une section avec séparateurs (évite double trait). */
  withTopRule?: boolean
  /** Pour aria-labelledby sur la section parente (si title est une chaîne). */
  titleId?: string
  /** Titre + sous-titre + note sur une ligne plus large (bloc partage mis en avant). */
  wideCopy?: boolean
}

export default function ShareInviteChannels({
  message,
  emailSubject,
  pageUrl = DEFAULT_PAGE_URL,
  title,
  subtitle,
  footnote,
  embed = false,
  withTopRule = true,
  titleId,
  wideCopy = false,
}: ShareInviteChannelsProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setIsMobile(/Mobile|Android|iPhone|iPad/i.test(navigator.userAgent))
  }, [])

  const encodedMsg = encodeURIComponent(`${message} ${pageUrl}`)
  const encodedSubject = encodeURIComponent(emailSubject)
  const encodedBody = encodeURIComponent(`${message}\n\n${pageUrl}`)

  function handleCopy() {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const copyMessageAndOpen = useCallback(
    (openUrl: string) => {
      const text = `${message} ${pageUrl}`.trim()
      void navigator.clipboard.writeText(text).then(() => {
        window.open(openUrl, '_blank', 'noopener,noreferrer')
      })
    },
    [message, pageUrl],
  )

  const handleInstagramShare = useCallback(
    () => copyMessageAndOpen('https://www.instagram.com/'),
    [copyMessageAndOpen],
  )

  const handleTikTokShare = useCallback(
    () => copyMessageAndOpen('https://www.tiktok.com/'),
    [copyMessageAndOpen],
  )

  const channels: Array<{
    id: string
    label: string
    color: string
    bg: string
    border: string
    mobileOnly?: boolean
    href?: string
    newTab?: boolean
    onPress?: () => void
    actionAriaLabel?: string
    icon?: string
    iconSvg?: ReactNode
  }> = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      iconSvg: <IconWhatsApp />,
      color: '#25D366',
      bg: 'rgba(37,211,102,0.1)',
      border: 'rgba(37,211,102,0.25)',
      href: `https://wa.me/?text=${encodedMsg}`,
      mobileOnly: false,
      newTab: true,
    },
    {
      id: 'sms',
      label: 'SMS',
      icon: 'sms',
      color: '#10B981',
      bg: 'rgba(16,185,129,0.1)',
      border: 'rgba(16,185,129,0.25)',
      href: `sms:?body=${encodedMsg}`,
      mobileOnly: true,
    },
    {
      id: 'email',
      label: 'E-mail',
      icon: 'email',
      color: 'var(--text-muted)',
      bg: 'var(--surface-2)',
      border: 'var(--border-hover)',
      href: `mailto:?subject=${encodedSubject}&body=${encodedBody}`,
      mobileOnly: false,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      iconSvg: <IconLinkedIn />,
      color: '#0A66C2',
      bg: 'rgba(10,102,194,0.1)',
      border: 'rgba(10,102,194,0.25)',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
      mobileOnly: false,
      newTab: true,
    },
    {
      id: 'facebook',
      label: 'Facebook',
      iconSvg: <IconFacebook />,
      color: '#1877F2',
      bg: 'rgba(24,119,242,0.1)',
      border: 'rgba(24,119,242,0.28)',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
      mobileOnly: false,
      newTab: true,
    },
    {
      id: 'instagram',
      label: 'Instagram',
      iconSvg: <IconInstagram />,
      color: '#E4405F',
      bg: 'rgba(228,64,95,0.1)',
      border: 'rgba(228,64,95,0.28)',
      mobileOnly: false,
      onPress: handleInstagramShare,
      actionAriaLabel:
        'Copier le message avec le lien, puis ouvrir Instagram pour le coller dans un message ou une story',
    },
    {
      id: 'tiktok',
      label: 'TikTok',
      iconSvg: <IconTikTok />,
      color: '#fe2c55',
      bg: 'rgba(254,44,85,0.1)',
      border: 'rgba(254,44,85,0.3)',
      mobileOnly: false,
      onPress: handleTikTokShare,
      actionAriaLabel:
        'Copier le message avec le lien, puis ouvrir TikTok pour le coller dans une publication ou un message',
    },
  ]

  const visibleChannels = channels.filter((c) => !c.mobileOnly || isMobile)
  const showHeader = title != null || subtitle != null

  return (
    <div
      className={embed ? 'share-invite-channels share-invite-channels--embed' : 'share-invite-channels'}
      style={{
        marginTop: withTopRule ? (embed ? 'clamp(14px, 2vw, 22px)' : '32px') : 0,
        paddingTop: withTopRule ? (embed ? 'clamp(22px, 2.8vw, 32px)' : '28px') : 0,
        borderTop: withTopRule ? '1px solid var(--border)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: wideCopy ? 'clamp(18px, 2.4vw, 26px)' : embed ? 'clamp(16px, 2.2vw, 22px)' : '20px',
      }}
    >
      {showHeader ? (
        <div style={{ textAlign: 'center', maxWidth: wideCopy ? 'min(92ch, 100%)' : 'min(52ch, 100%)' }}>
          {title != null ? (
            <p
              id={typeof title === 'string' ? titleId : undefined}
              className="font-fraunces"
              style={{
                fontSize: wideCopy
                  ? 'clamp(1.18rem, 0.5vw + 1.02rem, 1.42rem)'
                  : embed
                    ? 'clamp(1rem, 0.3vw + 0.92rem, 1.08rem)'
                    : '1.1rem',
                fontWeight: 700,
                color: 'var(--text)',
                margin: '0 0 8px',
                fontStyle: 'italic',
                lineHeight: 1.35,
              }}
            >
              {title}
            </p>
          ) : null}
          {subtitle != null ? (
            <p
              style={{
                fontSize: wideCopy
                  ? 'clamp(0.9rem, 0.22vw + 0.82rem, 1rem)'
                  : embed
                    ? 'clamp(0.8rem, 0.15vw + 0.76rem, 0.88rem)'
                    : '0.82rem',
                color: 'var(--text-muted)',
                margin: 0,
                lineHeight: 1.55,
              }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
      ) : null}

      <div
        className="share-invite-channels__row"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {visibleChannels.map((c) => {
          const pillStyle: CSSProperties = {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            background: c.bg,
            border: `1px solid ${c.border}`,
            borderRadius: '10px',
            padding: '9px 16px',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: c.color,
            textDecoration: 'none',
            transition: 'filter 150ms, transform 150ms',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }

          const iconEl =
            c.iconSvg != null ? (
              c.iconSvg
            ) : (
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }} aria-hidden="true">
                {c.icon}
              </span>
            )

          const hoverIn = (e: MouseEvent<HTMLElement>) => {
            e.currentTarget.style.filter = 'brightness(1.15)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }
          const hoverOut = (e: MouseEvent<HTMLElement>) => {
            e.currentTarget.style.filter = 'brightness(1)'
            e.currentTarget.style.transform = 'translateY(0)'
          }

          if (c.onPress != null) {
            return (
              <button
                key={c.id}
                type="button"
                onClick={c.onPress}
                style={pillStyle}
                onMouseEnter={hoverIn}
                onMouseLeave={hoverOut}
                aria-label={c.actionAriaLabel ?? `Inviter un confrère via ${c.label}`}
              >
                {iconEl}
                <span className="share-invite-channels__label">{c.label}</span>
              </button>
            )
          }

          return (
            <a
              key={c.id}
              href={c.href}
              target={c.newTab ? '_blank' : undefined}
              rel={c.newTab ? 'noopener noreferrer' : undefined}
              style={pillStyle}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
              aria-label={`Inviter un confrère via ${c.label}`}
            >
              {iconEl}
              <span className="share-invite-channels__label">{c.label}</span>
            </a>
          )
        })}

        <button
          type="button"
          onClick={handleCopy}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            background: copied ? 'var(--match-btn-bg)' : 'var(--surface-2)',
            border: `1px solid ${copied ? 'var(--match-btn-border)' : 'var(--border-hover)'}`,
            borderRadius: '10px',
            padding: '9px 16px',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: copied ? 'var(--success)' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 200ms',
          }}
          aria-label={copied ? 'Lien copié dans le presse-papiers' : 'Copier le lien pour inviter un confrère'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }} aria-hidden="true">
            {copied ? 'check_circle' : 'content_copy'}
          </span>
          <span className="share-invite-channels__label">{copied ? 'Lien copié !' : 'Copier le lien'}</span>
        </button>
      </div>

      {footnote != null ? (
        <p
          style={{
            fontSize: '0.72rem',
            color: 'var(--text-subtle)',
            margin: 0,
            textAlign: 'center',
            maxWidth: wideCopy ? 'min(88ch, 100%)' : 'min(56ch, 100%)',
            lineHeight: 1.45,
          }}
        >
          {footnote}
        </p>
      ) : null}
    </div>
  )
}
