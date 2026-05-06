'use client'

import { buildSharePageUrl } from '@/lib/share-public-invite'
import {
  PIONNIER_EMAIL_SUBJECT,
  PIONNIER_SHARE_MESSAGE,
  PIONNIER_SHARE_MESSAGES,
} from '@/lib/share-pionnier-invite'
import ShareInviteChannels from './share-invite-channels'

type InvitationBlockProps = {
  /** MD5 hex (32 car.) : liens avec `?source=` : après inscription uniquement. */
  shareSource?: string | null
}

export default function InvitationBlock({ shareSource }: InvitationBlockProps) {
  return (
    <ShareInviteChannels
      pageUrl={buildSharePageUrl(shareSource)}
      message={PIONNIER_SHARE_MESSAGE}
      messagesByChannel={PIONNIER_SHARE_MESSAGES}
      emailSubject={PIONNIER_EMAIL_SUBJECT}
      title="Vous avez trouvé le bon plan avant les autres."
      subtitle={
        <>
          Invitez un confrère — en exclusivité.{' '}
          <span style={{ color: 'var(--text-subtle)', fontSize: '0.78rem' }}>
            Celui qui invite passe pour celui qui sait.
          </span>
        </>
      }
      footnote="Les 50 places Pionniers sont nominatives. Chaque invitation compte."
    />
  )
}
