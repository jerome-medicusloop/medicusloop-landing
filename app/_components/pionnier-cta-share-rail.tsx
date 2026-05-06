'use client'

import type { ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'
import type { ShareInviteChannelId } from '@/lib/share-public-invite'
import {
  buildShareInviteDeepLink,
  SHARE_PUBLIC_MESSAGES,
  SHARE_PUBLIC_PAGE_URL,
} from '@/lib/share-public-invite'
import { IconFacebook, IconLinkedIn, IconWhatsApp, IconX } from './share-channel-icons'

const ICON_SZ = 22

type RailItem = {
  id: ShareInviteChannelId
  aria: string
  href?: string
  newTab?: boolean
  onPress?: () => void
  color: string
  bg: string
  border: string
  icon?: 'email'
  iconSvg?: ReactNode
}

export default function PionnierCtaShareRail() {
  const [copied, setCopied] = useState(false)

  const pageUrl = SHARE_PUBLIC_PAGE_URL
  const messagesByChannel = SHARE_PUBLIC_MESSAGES

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }, [pageUrl])

  const items: RailItem[] = useMemo(() => {
    return [
      {
        id: 'whatsapp',
        aria: 'Partager via WhatsApp',
        href: buildShareInviteDeepLink('whatsapp', pageUrl, messagesByChannel),
        newTab: true,
        color: '#25D366',
        bg: 'rgba(37,211,102,0.12)',
        border: 'rgba(37,211,102,0.35)',
        iconSvg: <IconWhatsApp size={ICON_SZ} />,
      },
      {
        id: 'email',
        aria: 'Partager par e-mail',
        href: buildShareInviteDeepLink('email', pageUrl, messagesByChannel),
        color: 'var(--text-muted)',
        bg: 'var(--surface-2)',
        border: 'var(--border-hover)',
        icon: 'email',
      },
      {
        id: 'linkedin',
        aria: 'Partager sur LinkedIn',
        href: buildShareInviteDeepLink('linkedin', pageUrl, messagesByChannel),
        newTab: true,
        color: '#0A66C2',
        bg: 'rgba(10,102,194,0.12)',
        border: 'rgba(10,102,194,0.32)',
        iconSvg: <IconLinkedIn size={ICON_SZ} />,
      },
      {
        id: 'facebook',
        aria: 'Partager sur Facebook',
        href: buildShareInviteDeepLink('facebook', pageUrl, messagesByChannel),
        newTab: true,
        color: '#1877F2',
        bg: 'rgba(24,119,242,0.12)',
        border: 'rgba(24,119,242,0.32)',
        iconSvg: <IconFacebook size={ICON_SZ} />,
      },
      {
        id: 'twitter',
        aria: 'Partager sur X',
        href: buildShareInviteDeepLink('twitter', pageUrl, messagesByChannel),
        newTab: true,
        color: 'var(--text)',
        bg: 'var(--surface-2)',
        border: 'var(--border-hover)',
        iconSvg: <IconX size={ICON_SZ} />,
      },
    ]
  }, [messagesByChannel, pageUrl])

  return (
    <nav className="pionnier-cta-share-rail" aria-label="Partager MedicusLoop — faire défiler horizontalement">
      <div className="pionnier-cta-share-rail__track">
        {items.map((c) => {
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
          aria-label={copied ? 'Lien copié' : 'Copier uniquement l’URL'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: ICON_SZ }} aria-hidden="true">
            {copied ? 'check_circle' : 'content_copy'}
          </span>
        </button>
      </div>
    </nav>
  )
}
