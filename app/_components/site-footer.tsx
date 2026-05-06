import Link from 'next/link'
import { PATH_CONDITIONS_GENERALES_UTILISATION } from '@/lib/legal-routes'
import MedicusLoopLogo from './medicusloop-logo'
import MentionsLegalesContactMail from './mentions-legales-contact-mail'
import { IconFacebook, IconInstagram, IconLinkedIn, IconTikTok, IconX } from './share-channel-icons'

const COMING_SOON = ['Kinésithérapeutes', 'Infirmiers', 'Pharmaciens'] as const

/** Lien vers la page CGU (même chemin que `lib/legal-routes`). */
export const SITE_FOOTER_CGU_HREF = PATH_CONDITIONS_GENERALES_UTILISATION

export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer" aria-label="Pied de page MedicusLoop">
      <div className="site-footer__grid">
        <div>
          <MedicusLoopLogo labeled className="footer-brand-logo" />
          <p className="site-footer__tagline">
            Un bloc,
            <br />
            un remplacement,
            <br />
            une expérience.
          </p>
        </div>

        <div>
          <p className="site-footer__col-title">Bientôt disponible pour</p>
          <ul className="site-footer__soon-list">
            {COMING_SOON.map((item) => (
              <li key={item} className="site-footer__soon-li">
                <span className="site-footer__soon-label">{item}</span>
                <span className="site-footer__soon-pill">Bientôt</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="site-footer__col-title">Contact</p>
          <div className="site-footer__contact-lines">
            <div className="site-footer__contact-line">
              <MentionsLegalesContactMail className="site-footer__contact-mail" />
            </div>
          </div>
          <div className="site-footer__social" aria-label="Réseaux sociaux">
            <p className="site-footer__col-title site-footer__social-heading">Réseaux sociaux</p>
            <ul className="site-footer__social-list">
              <li>
                <a
                  href="https://x.com/MedicusLoop"
                  className="site-footer__social-link"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label="MedicusLoop sur X — ouvre un nouvel onglet"
                >
                  <IconX size={16} />
                  <span>X</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/medicusloop"
                  className="site-footer__social-link"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label="MedicusLoop sur LinkedIn — ouvre un nouvel onglet"
                >
                  <IconLinkedIn size={16} />
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/medicusloop"
                  className="site-footer__social-link"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label="MedicusLoop sur Facebook — ouvre un nouvel onglet"
                >
                  <IconFacebook size={16} />
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/medicusloop"
                  className="site-footer__social-link"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label="MedicusLoop sur Instagram — ouvre un nouvel onglet"
                >
                  <IconInstagram size={16} />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@medicusloop"
                  className="site-footer__social-link"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label="MedicusLoop sur TikTok — ouvre un nouvel onglet"
                >
                  <IconTikTok size={16} />
                  <span>TikTok</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="site-footer__bar">
        <span className="site-footer__copy">© {year} MedicusLoop</span>
        <div className="site-footer__legal">
          <Link href="/mentions-legales" prefetch={false} rel="nofollow">
            Mentions légales
          </Link>
          <Link href={SITE_FOOTER_CGU_HREF} prefetch={false} rel="nofollow">
            Conditions générales d&apos;utilisation
          </Link>
        </div>
      </div>
    </footer>
  )
}
