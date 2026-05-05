'use client'

import { useEffect, useId, useRef } from 'react'
import ShareInviteChannels from './share-invite-channels'
import { SHARE_PUBLIC_EMAIL_SUBJECT, SHARE_PUBLIC_MESSAGE, SHARE_PUBLIC_PAGE_URL } from '@/lib/share-public-invite'

type ShareInviteDialogProps = {
  open: boolean
  onClose: () => void
}

export default function ShareInviteDialog({ open, onClose }: ShareInviteDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      const scrollY = window.scrollY
      d.showModal()
      /* Certains moteurs déplacent le scroll à l’ouverture du dialog dans le flux ; on rétablit la position. */
      const restoreScroll = () => {
        window.scrollTo({ top: scrollY, left: 0, behavior: 'auto' })
      }
      restoreScroll()
      requestAnimationFrame(restoreScroll)
    }
    if (!open && d.open) {
      d.close()
    }
  }, [open])

  useEffect(() => {
    const d = ref.current
    if (!d) return
    const onDialogClose = () => {
      onClose()
    }
    d.addEventListener('close', onDialogClose)
    return () => d.removeEventListener('close', onDialogClose)
  }, [onClose])

  return (
    <dialog ref={ref} className="share-invite-dialog" aria-labelledby={titleId}>
      <button
        type="button"
        className="share-invite-dialog__close"
        onClick={() => ref.current?.close()}
        aria-label="Fermer la fenêtre"
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          close
        </span>
      </button>

      <div className="share-invite-dialog__inner">
        <h2 id={titleId} className="share-invite-dialog__title font-fraunces">
          Inviter un confrère
        </h2>
        <p className="share-invite-dialog__lead">
          Partage simple, sans inscription : envoyez le lien public du site par le canal de votre choix.
        </p>
        <p className="share-invite-dialog__sublead">
          Il n’y a pas d’espace de connexion : ce partage envoie le lien public du site. Après l’envoi du
          formulaire Pionnier, vous recevrez un lien personnalisé pour le parrainage.
        </p>

        <div className="share-invite-dialog__channels">
          <ShareInviteChannels
            withTopRule={false}
            pageUrl={SHARE_PUBLIC_PAGE_URL}
            message={SHARE_PUBLIC_MESSAGE}
            emailSubject={SHARE_PUBLIC_EMAIL_SUBJECT}
          />
        </div>
      </div>
    </dialog>
  )
}
