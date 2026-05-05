'use client'

import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'

const DEFAULT_PAGE_URL = 'https://medicus-loop.com'

function IconFacebook({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path
        fill="currentColor"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  )
}

function IconInstagram({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path
        fill="currentColor"
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
      />
    </svg>
  )
}

/** Logo TikTok (monochrome, repère Simple Icons). */
function IconTikTok({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path
        fill="currentColor"
        d="M12.525.02c1.31-.02 2.61-.01 3.928-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48.04 2.96-.04 4.44-.9-.22-1.84-.1-2.65.34-1.09.62-1.78 1.78-1.88 3.01.04.81.32 1.62.82 2.28.89 1.1 2.33 1.67 3.74 1.59.84-.04 1.67-.32 2.37-.79 1.38-.86 2.13-2.43 2.01-3.97V.02h-.01z"
      />
    </svg>
  )
}

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
      icon: 'chat',
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
      icon: 'work',
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
