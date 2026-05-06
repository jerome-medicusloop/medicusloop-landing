import type { Metadata } from 'next'
import Link from 'next/link'
import { getWaitlistPionniersCount } from '@/lib/waitlist-pionniers-count'
import { PIONNIER_PLACES_TOTAL } from '@/lib/pionnier-constants'
import MentionsLegalesContactMail from '../_components/mentions-legales-contact-mail'
import Navbar from '../_components/site-navbar'
import SiteFooter from '../_components/site-footer'

export const metadata: Metadata = {
  title: 'Conditions générales d’utilisation',
  description:
    'Conditions encadrant l’utilisation du site MedicusLoop, les formulaires et le programme Pionniers (liste d’attente).',
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
}

export default async function ConditionsGeneralesUtilisationPage() {
  const placesPrises = await getWaitlistPionniersCount()
  const listePleinePionniers = placesPrises >= PIONNIER_PLACES_TOTAL

  return (
    <>
      <Navbar listePleinePionniers={listePleinePionniers} />
      <main
        id="conditions-generales-utilisation"
        className="mentions-legales-main"
        aria-labelledby="cgu-title"
      >
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
              <h1 id="cgu-title" className="font-fraunces mentions-legales-h1">
                Conditions générales d&apos;utilisation
              </h1>
              <span className="mentions-legales-h1-rule" aria-hidden="true" />
              <p className="mentions-legales-lead">
                Les présentes conditions générales d&apos;utilisation (ci-après les « <strong>CGU</strong> »)
                s&apos;appliquent à toute visite ou utilisation du site accessible à l&apos;adresse{' '}
                <Link href="/" prefetch={false} className="mentions-legales-inline-mailto">
                  www.medicus-loop.com
                </Link>{' '}
                (le « <strong>Site</strong> »),
                édité par <strong>MedicusLoop</strong>.
              </p>
            </header>

            <div className="mentions-legales-stack">
              <section className="mentions-legales-block" aria-labelledby="cgu-objet">
                <h2 id="cgu-objet" className="mentions-legales-h2">
                  Objet
                </h2>
                <div className="mentions-legales-block-body">
                  <p>
                    Les CGU définissent le cadre juridique dans lequel MedicusLoop met à votre disposition le
                    Site et les fonctionnalités proposées aujourd&apos;hui (présentation du projet, inscription
                    à la liste d&apos;attente, programme Pionniers, formulaires associés). Elles complètent les
                    informations figurant dans les{' '}
                    <Link href="/mentions-legales" prefetch={false} className="mentions-legales-inline-mailto">
                      mentions légales
                    </Link>
                    .
                  </p>
                  <p>
                    Le Site évoluera avec le lancement de la plateforme MedicusLoop ; les CGU pourront être
                    mises à jour. La date de dernière révision est indiquée en bas de page.
                  </p>
                </div>
              </section>

              <section className="mentions-legales-block" aria-labelledby="cgu-acceptation">
                <h2 id="cgu-acceptation" className="mentions-legales-h2">
                  Acceptation
                </h2>
                <div className="mentions-legales-block-body">
                  <p>
                    En accédant au Site, en naviguant sur ses pages ou en soumettant un formulaire (notamment
                    d&apos;inscription), vous reconnaissez avoir pris connaissance des CGU et les accepter sans
                    réserve. Si vous n&apos;acceptez pas tout ou partie des CGU, vous devez cesser d&apos;utiliser
                    le Site.
                  </p>
                </div>
              </section>

              <section className="mentions-legales-block" aria-labelledby="cgu-services">
                <h2 id="cgu-services" className="mentions-legales-h2">
                  Services proposés
                </h2>
                <div className="mentions-legales-block-body">
                  <p>
                    À ce stade, le Site a vocation à informer sur MedicusLoop (remplacement MAR, contrat,
                    LoopExpérience) et à recueillir des demandes d&apos;intérêt ou d&apos;inscription
                    (liste d&apos;attente, programme Pionniers dans la limite des places indiquées sur le Site).
                  </p>
                  <p>
                    Aucune prestation médicale, aucune mise en relation opérationnelle et aucun contrat de
                    mission n&apos;est conclu par le seul fait d&apos;une inscription via le Site : ces étapes
                    interviendront ultérieurement sur la plateforme, sous des conditions qui vous seront
                    communiquées au moment opportun.
                  </p>
                </div>
              </section>

              <section className="mentions-legales-block" aria-labelledby="cgu-comportement">
                <h2 id="cgu-comportement" className="mentions-legales-h2">
                  Comportement et usage loyal
                </h2>
                <div className="mentions-legales-block-body">
                  <p>
                    Vous vous engagez à utiliser le Site de manière conforme aux lois et règlements applicables,
                    notamment en matière de données personnelles et de propriété intellectuelle, et à ne pas
                    porter atteinte au bon fonctionnement du Site (tentatives d&apos;intrusion, surcharge
                    abusive, contenus illicites, etc.).
                  </p>
                </div>
              </section>

              <section className="mentions-legales-block" aria-labelledby="cgu-pi">
                <h2 id="cgu-pi" className="mentions-legales-h2">
                  Propriété intellectuelle
                </h2>
                <div className="mentions-legales-block-body">
                  <p>
                    Les éléments du Site (textes, visuels, marques, logos, structure) sont protégés. Toute
                    reproduction ou exploitation non autorisée est interdite sauf acte autorisé par la loi ou
                    accord écrit préalable de MedicusLoop.
                  </p>
                </div>
              </section>

              <section className="mentions-legales-block" aria-labelledby="cgu-donnees">
                <h2 id="cgu-donnees" className="mentions-legales-h2">
                  Données personnelles
                </h2>
                <div className="mentions-legales-block-body">
                  <p>
                    Les traitements de données réalisés via le Site sont décrits dans les{' '}
                    <Link href="/mentions-legales" prefetch={false} className="mentions-legales-inline-mailto">
                      mentions légales
                    </Link>{' '}
                    (section « Données personnelles (RGPD) »). Les cases à cocher du formulaire d&apos;inscription
                    permettent de recueillir votre consentement lorsque celui-ci est requis.
                  </p>
                </div>
              </section>

              <section className="mentions-legales-block" aria-labelledby="cgu-cookies">
                <h2 id="cgu-cookies" className="mentions-legales-h2">
                  Cookies et traceurs
                </h2>
                <div className="mentions-legales-block-body">
                  <p>
                    Le Site peut déposer des cookies ou traceurs soumis à votre consentement lorsque la
                    réglementation l&apos;exige. Vous pouvez paramétrer vos choix via le bandeau ou l&apos;outil
                    de gestion du consentement proposé sur le Site le cas échéant.
                  </p>
                </div>
              </section>

              <section className="mentions-legales-block" aria-labelledby="cgu-modif">
                <h2 id="cgu-modif" className="mentions-legales-h2">
                  Modification des CGU
                </h2>
                <div className="mentions-legales-block-body">
                  <p>
                    MedicusLoop peut adapter les CGU pour refléter l&apos;évolution du Site ou du cadre légal.
                    La version applicable est celle publiée sur cette page, avec sa date de mise à jour. Nous
                    vous invitons à consulter régulièrement cette page lorsque vous utilisez le Site.
                  </p>
                </div>
              </section>

              <section className="mentions-legales-block" aria-labelledby="cgu-droit">
                <h2 id="cgu-droit" className="mentions-legales-h2">
                  Droit applicable
                </h2>
                <div className="mentions-legales-block-body">
                  <p>
                    Les CGU sont régies par le <strong>droit français</strong>. En cas de litige relatif à
                    l&apos;interprétation ou à l&apos;exécution des présentes, et à défaut de solution amiable,
                    les tribunaux français seront seuls compétents, sous réserve d&apos;une attribution de
                    compétence impérative.
                  </p>
                </div>
              </section>

              <section className="mentions-legales-block" aria-labelledby="cgu-contact">
                <h2 id="cgu-contact" className="mentions-legales-h2">
                  Contact
                </h2>
                <div className="mentions-legales-block-body">
                  <p>
                    Pour toute question relative aux CGU ou au Site : <MentionsLegalesContactMail />
                  </p>
                </div>
              </section>
            </div>

            <footer className="mentions-legales-maj">
              <time dateTime={new Date().toISOString().slice(0, 10)}>
                Dernière mise à jour :{' '}
                {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date())}
              </time>
            </footer>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
