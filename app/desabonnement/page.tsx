import type { Metadata } from 'next'
import Link from 'next/link'
import { z } from 'zod'
import { getWaitlistPionniersCount } from '@/lib/waitlist-pionniers-count'
import { PIONNIER_PLACES_TOTAL } from '@/lib/pionnier-constants'
import { getWaitlistUnsubscribePreview } from '@/lib/waitlist-unsubscribe-lookup'
import Navbar from '../_components/site-navbar'
import SiteFooter from '../_components/site-footer'
import DesabonnementForm from './desabonnement-form'

export const metadata: Metadata = {
  title: 'Désabonnement e-mails',
  description:
    'Confirmer l’arrêt des e-mails d’information MedicusLoop (liste d’attente) — lien personnel sécurisé.',
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
}

export default async function DesabonnementPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string; ok?: string }>
}) {
  const sp = await searchParams
  const placesPrises = await getWaitlistPionniersCount()
  const listePleinePionniers = placesPrises >= PIONNIER_PLACES_TOTAL

  if (sp.ok === '1') {
    return (
      <>
        <Navbar listePleinePionniers={listePleinePionniers} />
        <main id="desabonnement" className="mentions-legales-main" aria-labelledby="desabonnement-title">
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
                <h1 id="desabonnement-title" className="font-fraunces mentions-legales-h1">
                  Désabonnement enregistré
                </h1>
                <span className="mentions-legales-h1-rule" aria-hidden="true" />
                <p className="mentions-legales-lead">
                  Vous ne recevrez plus d’e-mails d’information de MedicusLoop sur cette adresse. Votre inscription sur
                  la liste d’attente reste en place si vous le souhaitez ; seuls les envois e-mail sont stoppés.
                </p>
              </header>
              <p className="desabonnement-footnote">
                Une question ?{' '}
                <a href="mailto:hello@medicus-loop.com" className="mentions-legales-inline-mailto">
                  hello@medicus-loop.com
                </a>
              </p>
            </article>
          </div>
        </main>
        <SiteFooter />
      </>
    )
  }

  const tokenRaw = sp.t?.trim() ?? ''
  const tokenOk = z.string().uuid().safeParse(tokenRaw).success

  if (!tokenOk) {
    return (
      <>
        <Navbar listePleinePionniers={listePleinePionniers} />
        <main id="desabonnement" className="mentions-legales-main" aria-labelledby="desabonnement-title">
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
                <h1 id="desabonnement-title" className="font-fraunces mentions-legales-h1">
                  Lien invalide
                </h1>
                <span className="mentions-legales-h1-rule" aria-hidden="true" />
                <p className="mentions-legales-lead">
                  Utilisez le lien reçu dans votre e-mail de confirmation MedicusLoop, ou copiez-collez l’adresse
                  complète depuis ce message. Si le problème continue, écrivez-nous sur{' '}
                  <a href="mailto:hello@medicus-loop.com" className="mentions-legales-inline-mailto">
                    hello@medicus-loop.com
                  </a>
                  .
                </p>
              </header>
            </article>
          </div>
        </main>
        <SiteFooter />
      </>
    )
  }

  let preview: Awaited<ReturnType<typeof getWaitlistUnsubscribePreview>> = null
  try {
    preview = await getWaitlistUnsubscribePreview(tokenRaw)
  } catch {
    preview = null
  }

  if (!preview) {
    return (
      <>
        <Navbar listePleinePionniers={listePleinePionniers} />
        <main id="desabonnement" className="mentions-legales-main" aria-labelledby="desabonnement-title">
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
                <h1 id="desabonnement-title" className="font-fraunces mentions-legales-h1">
                  Lien non reconnu
                </h1>
                <span className="mentions-legales-h1-rule" aria-hidden="true" />
                <p className="mentions-legales-lead">
                  Ce lien ne correspond à aucune inscription active, ou la base n’est pas encore à jour. Contactez-nous
                  sur{' '}
                  <a href="mailto:hello@medicus-loop.com" className="mentions-legales-inline-mailto">
                    hello@medicus-loop.com
                  </a>{' '}
                  si vous souhaitez arrêter les e-mails.
                </p>
              </header>
            </article>
          </div>
        </main>
        <SiteFooter />
      </>
    )
  }

  if (preview.alreadyUnsubscribed) {
    return (
      <>
        <Navbar listePleinePionniers={listePleinePionniers} />
        <main id="desabonnement" className="mentions-legales-main" aria-labelledby="desabonnement-title">
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
                <h1 id="desabonnement-title" className="font-fraunces mentions-legales-h1">
                  Déjà désabonné(e)
                </h1>
                <span className="mentions-legales-h1-rule" aria-hidden="true" />
                <p className="mentions-legales-lead">
                  L’adresse <strong>{preview.email}</strong> est déjà enregistrée comme ne souhaitant plus recevoir
                  d’e-mails d’information MedicusLoop.
                </p>
              </header>
              <p className="desabonnement-footnote">
                <Link href="/" prefetch={false} className="mentions-legales-inline-mailto">
                  Retour à l’accueil
                </Link>
              </p>
            </article>
          </div>
        </main>
        <SiteFooter />
      </>
    )
  }

  return (
    <>
      <Navbar listePleinePionniers={listePleinePionniers} />
      <main id="desabonnement" className="mentions-legales-main" aria-labelledby="desabonnement-title">
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
              <h1 id="desabonnement-title" className="font-fraunces mentions-legales-h1">
                E-mails MedicusLoop
              </h1>
              <span className="mentions-legales-h1-rule" aria-hidden="true" />
              <p className="mentions-legales-lead">
                Si vous souhaitez vous désinscrire des e-mails envoyés par MedicusLoop MAR, remplissez le formulaire
                ci-dessous et confirmez votre choix de désinscription. Ce lien est personnel : ne le partagez pas.
              </p>
            </header>
            <DesabonnementForm token={tokenRaw} email={preview.email} />
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
