import type { Metadata } from 'next'
import Link from 'next/link'
import { getWaitlistPionniersCount } from '@/lib/waitlist-pionniers-count'
import { PIONNIER_PLACES_TOTAL } from '@/lib/pionnier-constants'
import Navbar from '../_components/site-navbar'
import SiteFooter from '../_components/site-footer'
import ContactForm from './contact-form'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez l’équipe MedicusLoop depuis un formulaire dédié.',
}

export default async function ContactPage() {
  const placesPrises = await getWaitlistPionniersCount()
  const listePleinePionniers = placesPrises >= PIONNIER_PLACES_TOTAL

  return (
    <>
      <Navbar listePleinePionniers={listePleinePionniers} />
      <main id="contact" className="mentions-legales-main" aria-labelledby="contact-title">
        <div className="ml-section-max mentions-legales-inner">
          <nav className="mentions-legales-back" aria-label="Navigation secondaire">
            <Link href="/" prefetch={false} className="mentions-legales-back-link">
              <span className="material-symbols-outlined mentions-legales-back-icon" aria-hidden="true">
                arrow_back
              </span>
              Retour à l’accueil
            </Link>
          </nav>

          <article className="mentions-legales-doc mentions-legales-shell">
            <header className="mentions-legales-hero">
              <h1 id="contact-title" className="font-fraunces mentions-legales-h1">
                Contact
              </h1>
              <span className="mentions-legales-h1-rule" aria-hidden="true" />
              <p className="mentions-legales-lead">
                Une question sur le lancement, les tarifs ou l’intégration côté établissement ? Écrivez-nous, l’équipe
                vous répond rapidement.
              </p>
            </header>

            <ContactForm />
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
