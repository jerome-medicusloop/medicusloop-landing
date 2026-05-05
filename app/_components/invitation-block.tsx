'use client'

import { buildSharePageUrl } from '@/lib/share-public-invite'
import ShareInviteChannels from './share-invite-channels'

const MESSAGE =
  "J'ai une info avant les autres : MedicusLoop lance la première plateforme MAR avec matching IA, contrat automatique et LoopExpérience sur mesure sur chaque lieu. Je viens de rejoindre en Pionnier — 50 places uniquement. Tu devrais regarder avant que ce soit complet :"

const SUBJECT = "J'ai trouvé le bon plan pour les rempla MAR"

type InvitationBlockProps = {
  /** MD5 hex (32 car.) : liens avec `?source=` : après inscription uniquement. */
  shareSource?: string | null
}

export default function InvitationBlock({ shareSource }: InvitationBlockProps) {
  return (
    <ShareInviteChannels
      pageUrl={buildSharePageUrl(shareSource)}
      message={MESSAGE}
      emailSubject={SUBJECT}
      title="Vous avez trouvé le bon plan avant les autres."
      subtitle={
        <>
          Invitez un confrère MAR — en exclusivité.{' '}
          <span style={{ color: 'var(--text-subtle)', fontSize: '0.78rem' }}>
            Celui qui invite passe pour celui qui sait.
          </span>
        </>
      }
      footnote="Les 50 places Pionniers sont nominatives. Chaque invitation compte."
    />
  )
}
