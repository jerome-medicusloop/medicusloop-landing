import ShareInviteChannels from './share-invite-channels'
import { SHARE_PUBLIC_EMAIL_SUBJECT, SHARE_PUBLIC_MESSAGE, SHARE_PUBLIC_PAGE_URL } from '@/lib/share-public-invite'

type SharePublicSectionProps = {
  /**
   * Intégré dans #pionniers : carte mise en avant, pleine largeur utile.
   * Sinon : bandeau entre deux sections (bordures haut/bas).
   */
  embedded?: boolean
}

/** Bloc invitation : lien public et canaux d’envoi aux confrères. */
export default function SharePublicSection({ embedded = false }: SharePublicSectionProps) {
  const shellClass = embedded
    ? 'share-public-section share-public-section--embedded'
    : 'share-public-section'

  const inner = (
    <div className="share-public-section__inner" data-reveal>
      <ShareInviteChannels
        withTopRule={false}
        titleId="share-public-title"
        pageUrl={SHARE_PUBLIC_PAGE_URL}
        message={SHARE_PUBLIC_MESSAGE}
        emailSubject={SHARE_PUBLIC_EMAIL_SUBJECT}
        wideCopy={embedded}
        title="Envie de faire découvrir MedicusLoop autour de vous ?"
        subtitle={
          <>
            <strong>Cliquez</strong> pour inviter vos confrères avec le <strong>lien public</strong>, sans inscription.
            <br />
            Après{' '}
            <a
              href="#inscription"
              className="share-public-section__inscription-link"
              aria-label="Votre inscription — aller au formulaire"
            >
              votre inscription
            </a>
            , le <strong>lien perso</strong> sur la confirmation sert au parrainage.
          </>
        }
      />
    </div>
  )

  if (embedded) {
    return (
      <div id="partage" className={shellClass} role="region" aria-labelledby="share-public-title">
        {inner}
      </div>
    )
  }

  return (
    <section className={shellClass} aria-labelledby="share-public-title">
      {inner}
    </section>
  )
}
