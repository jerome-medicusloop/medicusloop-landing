'use client'

import type { ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { SHARE_PUBLIC_EMAIL_SUBJECT, SHARE_PUBLIC_MESSAGE, SHARE_PUBLIC_PAGE_URL } from '@/lib/share-public-invite'
import { IconFacebook, IconInstagram, IconLinkedIn, IconTikTok, IconWhatsApp } from './share-channel-icons'

const ICON_SZ = 22

type RailItem = {
  id: string
  aria: string
  href?: string
  newTab?: boolean
  onPress?: () => void
  color: string
  bg: string
  border: string
  mobileOnly?: boolean
  icon?: 'sms' | 'email'
  iconSvg?: ReactNode
}

export default function PionnierCtaShareRail() {
  const [isMobileUa, setIsMobileUa] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setIsMobileUa(/Mobile|Android|iPhone|iPad/i.test(navigator.userAgent))
  }, [])

  const pageUrl = SHARE_PUBLIC_PAGE_URL
  const message = SHARE_PUBLIC_MESSAGE
  const emailSubject = SHARE_PUBLIC_EMAIL_SUBJECT

  const encodedMsg = encodeURIComponent(`${message} ${pageUrl}`)
  const encodedSubject = encodeURIComponent(emailSubject)
  const encodedBody = encodeURIComponent(`${message}\n\n${pageUrl}`)

  const copyMessageAndOpen = useCallback(
    (openUrl: string) => {
      const text = `${message} ${pageUrl}`.trim()
      void navigator.clipboard.writeText(text).then(() => {
        window.open(openUrl, '_blank', 'noopener,noreferrer')
      })
    },
    [message, pageUrl],
  )

  const handleInstagram = useCallback(() => copyMessageAndOpen('https://www.instagram.com/'), [copyMessageAndOpen])
  const handleTikTok = useCallback(() => copyMessageAndOpen('https://www.tiktok.com/'), [copyMessageAndOpen])

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }, [pageUrl])

  const items: RailItem[] = [
    {
      id: 'wa',
      aria: 'Partager via WhatsApp',
      href: `https://wa.me/?text=${encodedMsg}`,
      newTab: true,
      color: '#25D366',
      bg: 'rgba(37,211,102,0.12)',
      border: 'rgba(37,211,102,0.35)',
      iconSvg: <IconWhatsApp size={ICON_SZ} />,
    },
    {
      id: 'sms',
      aria: 'Partager par SMS',
      href: `sms:?body=${encodedMsg}`,
      mobileOnly: true,
      color: '#10B981',
      bg: 'rgba(16,185,129,0.12)',
      border: 'rgba(16,185,129,0.35)',
      icon: 'sms',
    },
    {
      id: 'mail',
      aria: 'Partager par e-mail',
      href: `mailto:?subject=${encodedSubject}&body=${encodedBody}`,
      color: 'var(--text-muted)',
      bg: 'var(--surface-2)',
      border: 'var(--border-hover)',
      icon: 'email',
    },
    {
      id: 'li',
      aria: 'Partager sur LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
      newTab: true,
      color: '#0A66C2',
      bg: 'rgba(10,102,194,0.12)',
      border: 'rgba(10,102,194,0.32)',
      iconSvg: <IconLinkedIn size={ICON_SZ} />,
    },
    {
      id: 'fb',
      aria: 'Partager sur Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
      newTab: true,
      color: '#1877F2',
      bg: 'rgba(24,119,242,0.12)',
      border: 'rgba(24,119,242,0.32)',
      iconSvg: <IconFacebook size={ICON_SZ} />,
    },
    {
      id: 'ig',
      aria: 'Copier le message puis ouvrir Instagram',
      onPress: handleInstagram,
      color: '#E4405F',
      bg: 'rgba(228,64,95,0.12)',
      border: 'rgba(228,64,95,0.32)',
      iconSvg: <IconInstagram size={ICON_SZ} />,
    },
    {
      id: 'tt',
      aria: 'Copier le message puis ouvrir TikTok',
      onPress: handleTikTok,
      color: '#fe2c55',
      bg: 'rgba(254,44,85,0.12)',
      border: 'rgba(254,44,85,0.32)',
      iconSvg: <IconTikTok size={ICON_SZ} />,
    },
  ]

  const visible = items.filter((c) => !c.mobileOnly || isMobileUa)

  return (
    <nav className="pionnier-cta-share-rail" aria-label="Partager MedicusLoop — faire défiler horizontalement">
      <div className="pionnier-cta-share-rail__track">
        {visible.map((c) => {
          const chipStyle = {
            color: c.color,
            background: c.bg,
            borderColor: c.border,
          } as const

          const inner =
            c.iconSvg != null ? (
              c.iconSvg
            ) : (
              <span className="material-symbols-outlined" style={{ fontSize: ICON_SZ }} aria-hidden="true">
                {c.icon}
              </span>
            )

          if (c.onPress != null) {
            return (
              <button
                key={c.id}
                type="button"
                className="pionnier-cta-share-rail__chip"
                style={chipStyle}
                onClick={c.onPress}
                aria-label={c.aria}
              >
                {inner}
              </button>
            )
          }

          return (
            <a
              key={c.id}
              href={c.href}
              target={c.newTab ? '_blank' : undefined}
              rel={c.newTab ? 'noopener noreferrer' : undefined}
              className="pionnier-cta-share-rail__chip"
              style={chipStyle}
              aria-label={c.aria}
            >
              {inner}
            </a>
          )
        })}

        <button
          type="button"
          className="pionnier-cta-share-rail__chip"
          style={{
            color: copied ? 'var(--success)' : 'var(--text-muted)',
            background: copied ? 'var(--match-btn-bg)' : 'var(--surface-2)',
            borderColor: copied ? 'var(--match-btn-border)' : 'var(--border-hover)',
          }}
          onClick={handleCopy}
          aria-label={copied ? 'Lien copié' : 'Copier le lien public'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: ICON_SZ }} aria-hidden="true">
            {copied ? 'check_circle' : 'content_copy'}
          </span>
        </button>
      </div>
    </nav>
  )
}
