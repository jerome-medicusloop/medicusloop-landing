'use client'

import { useCallback, useState } from 'react'
import { inscriptionCtaFromListePleine } from '@/lib/pionnier-constants'
import PionnierCtaShareRail from './pionnier-cta-share-rail'
import ShareInviteDialog from './share-invite-dialog'

type PionnierCtaStripProps = {
  /** Liste Pionniers à 50/50 : libellé « M’inscrire » au lieu de « Devenir Pionnier ». */
  listePleinePionniers?: boolean
  /** id du bouton « Inviter un confrère » (lien depuis le compteur liste pleine, etc.). */
  inviterButtonId?: string
  /** Faux : masque invitation confrère, rail d’icônes et modale (ex. sections #profils, #comment-ca-marche, #loopexperience). */
  withShareInvite?: boolean
}

export default function PionnierCtaStrip({
  listePleinePionniers = false,
  inviterButtonId,
  withShareInvite = true,
}: PionnierCtaStripProps) {
  const cta = inscriptionCtaFromListePleine(listePleinePionniers)
  const [shareOpen, setShareOpen] = useState(false)
  const closeShare = useCallback(() => setShareOpen(false), [])

  return (
    <div
      className={['pionnier-cta-strip', !withShareInvite && 'pionnier-cta-strip--inscription-only']
        .filter(Boolean)
        .join(' ')}
      data-reveal
    >
      <div
        className="pionnier-cta-strip__actions"
        role="group"
        aria-label={withShareInvite ? 'Inscription et partage' : 'Inscription'}
      >
        <a
          href="#inscription"
          className="nav-cta nav-cta--quiet pionnier-cta-strip__inscription"
          aria-label={cta.ariaStrip}
        >
          <span className="material-symbols-outlined nav-cta__icon" aria-hidden="true">
            {cta.icon}
          </span>
          {cta.label}
        </a>
        {withShareInvite ? (
          <button
            id={inviterButtonId}
            type="button"
            className="nav-cta nav-cta--quiet nav-cta--secondary pionnier-cta-strip__share"
            aria-label="Ouvrir les options pour inviter un confrère avec le lien MedicusLoop"
            aria-haspopup="dialog"
            aria-expanded={shareOpen}
            onClick={() => setShareOpen(true)}
          >
            <span className="material-symbols-outlined nav-cta__icon" aria-hidden="true">
              share
            </span>
            <span className="pionnier-cta-strip__lbl-share">Inviter un confrère</span>
          </button>
        ) : null}
      </div>
      {withShareInvite ? (
        <>
          <p className="pionnier-cta-strip__share-hint">et/ou partagez sur&nbsp;:</p>
          <PionnierCtaShareRail />
          <ShareInviteDialog open={shareOpen} onClose={closeShare} />
        </>
      ) : null}
    </div>
  )
}
