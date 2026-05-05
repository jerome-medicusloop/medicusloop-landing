'use client'

import ShareInviteChannels from './share-invite-channels'
import { SHARE_PUBLIC_EMAIL_SUBJECT, SHARE_PUBLIC_MESSAGE, SHARE_PUBLIC_PAGE_URL } from '@/lib/share-public-invite'

export default function FooterShare() {
  return (
    <div className="footer-share" role="region" aria-labelledby="footer-share-title">
      <ShareInviteChannels
        withTopRule={false}
        titleId="footer-share-title"
        pageUrl={SHARE_PUBLIC_PAGE_URL}
        message={SHARE_PUBLIC_MESSAGE}
        emailSubject={SHARE_PUBLIC_EMAIL_SUBJECT}
        title="Vos confrères méritent l’info en premier"
      />
    </div>
  )
}
