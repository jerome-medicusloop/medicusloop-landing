'use client'

import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getShareDeviceProfile, type ShareDeviceProfile } from '@/lib/share-device-detection'
import type { ShareInviteChannelId } from '@/lib/share-public-invite'
import {
  SHARE_PUBLIC_EMAIL_SUBJECT,
  SHARE_PUBLIC_MESSAGES,
  SHARE_PUBLIC_PAGE_URL,
  SHARE_PUBLIC_MESSAGE,
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
  mobileOnly?: boolean
  icon?: 'sms' | 'email'
  iconSvg?: ReactNode
}

export default function PionnierCtaShareRail() {
  const [shareDevice, setShareDevice] = useState<ShareDeviceProfile>(() => ({
    legacyMobileUa: false,
    likelyMobileOrTablet: false,
    likelyPhone: false,
    coarsePointer: false,
    hoverNone: false,
  }))
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setShareDevice(getShareDeviceProfile())
  }, [])

  const pageUrl = SHARE_PUBLIC_PAGE_URL
  const messagesByChannel = SHARE_PUBLIC_MESSAGES
  const fallback = SHARE_PUBLIC_MESSAGE
  const emailSubject = SHARE_PUBLIC_EMAIL_SUBJECT

  const textFor = useCallback(
    (id: ShareInviteChannelId) => messagesByChannel[id] ?? fallback,
    [messagesByChannel, fallback],
  )

  const fullText = useCallback(
    (id: ShareInviteChannelId) => `${textFor(id)} ${pageUrl}`.trim(),
    [textFor, pageUrl],
  )

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }, [pageUrl])

  const items: RailItem[] = useMemo(() => {
    const u = encodeURIComponent(pageUrl)
    const sub = encodeURIComponent(emailSubject)
    const mailBody = encodeURIComponent(`${textFor('email')}\n\n${pageUrl}`)
    const fbQuote = encodeURIComponent(textFor('facebook'))
    const twText = encodeURIComponent(textFor('twitter'))

    return [
      {
        id: 'whatsapp',
        aria: 'Partager via WhatsApp',
        href: `https://wa.me/?text=${encodeURIComponent(fullText('whatsapp'))}`,
        newTab: true,
        color: '#25D366',
        bg: 'rgba(37,211,102,0.12)',
        border: 'rgba(37,211,102,0.35)',
        iconSvg: <IconWhatsApp size={ICON_SZ} />,
      },
      {
        id: 'sms',
        aria: 'Partager par SMS',
        href: `sms:?body=${encodeURIComponent(fullText('sms'))}`,
        mobileOnly: true,
        color: '#10B981',
        bg: 'rgba(16,185,129,0.12)',
        border: 'rgba(16,185,129,0.35)',
        icon: 'sms',
      },
      {
        id: 'email',
        aria: 'Partager par e-mail',
        href: `mailto:?subject=${sub}&body=${mailBody}`,
        color: 'var(--text-muted)',
        bg: 'var(--surface-2)',
        border: 'var(--border-hover)',
        icon: 'email',
      },
      {
        id: 'linkedin',
        aria: 'Partager sur LinkedIn',
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
        newTab: true,
        color: '#0A66C2',
        bg: 'rgba(10,102,194,0.12)',
        border: 'rgba(10,102,194,0.32)',
        iconSvg: <IconLinkedIn size={ICON_SZ} />,
      },
      {
        id: 'facebook',
        aria: 'Partager sur Facebook',
        href: `https://www.facebook.com/sharer/sharer.php?u=${u}&quote=${fbQuote}`,
        newTab: true,
        color: '#1877F2',
        bg: 'rgba(24,119,242,0.12)',
        border: 'rgba(24,119,242,0.32)',
        iconSvg: <IconFacebook size={ICON_SZ} />,
      },
      {
        id: 'twitter',
        aria: 'Partager sur X',
        href: `https://twitter.com/intent/tweet?text=${twText}&url=${u}`,
        newTab: true,
        color: 'var(--text)',
        bg: 'var(--surface-2)',
        border: 'var(--border-hover)',
        iconSvg: <IconX size={ICON_SZ} />,
      },
    ]
  }, [emailSubject, fullText, pageUrl, textFor])

  const visible = items.filter((c) => !c.mobileOnly || shareDevice.likelyMobileOrTablet)

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
