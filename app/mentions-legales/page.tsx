import type { Metadata } from 'next'
import Link from 'next/link'
import { PATH_CONDITIONS_GENERALES_UTILISATION } from '@/lib/legal-routes'
import { getWaitlistPionniersCount } from '@/lib/waitlist-pionniers-count'
import { PIONNIER_PLACES_TOTAL } from '@/lib/pionnier-constants'
import MentionsLegalesContactMail from '../_components/mentions-legales-contact-mail'
import Navbar from '../_components/site-navbar'
import SiteFooter from '../_components/site-footer'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description:
    'Informations relatives à l’éditeur, à l’hébergement, au RGPD et au cadre du site MedicusLoop (landing page).',
  robots: { index: false, follow: true },
}

export default async function MentionsLegalesPage() {
  const placesPrises = await getWaitlistPionniersCount()
  const listePleinePionniers = placesPrises >= PIONNIER_PLACES_TOTAL

  return (
    <>
      <Navbar listePleinePionniers={listePleinePionniers} />
      <main id="mentions-legales" className="mentions-legales-main" aria-labelledby="mentions-legales-title">
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
              <h1 id="mentions-legales-title" className="font-fraunces mentions-legales-h1">
                Mentions légales
              </h1>
              <span className="mentions-legales-h1-rule" aria-hidden="true" />
              <p className="mentions-legales-lead">
                Site accessible à l’adresse{' '}
                <Link href="/" prefetch={false} className="mentions-legales-inline-mailto">
                  www.medicus-loop.com
                </Link>{' '}
                (ci-après le « Site »). Les{' '}
                <Link href={PATH_CONDITIONS_GENERALES_UTILISATION} prefetch={false} className="mentions-legales-inline-mailto">
                  conditions générales d&apos;utilisation
                </Link>{' '}
                précisent le cadre d&apos;usage du Site et des formulaires.
              </p>
            </header>

            <div className="mentions-legales-stack">
              <section className="mentions-legales-block" aria-labelledby="ml-editeur">
                <h2 id="ml-editeur" className="mentions-legales-h2">
                  Éditeur du Site
                </h2>
                <div className="mentions-legales-block-body">
                  <p>
                    Le Site est édité par la société <strong>MedicusLoop</strong>,{' '}
                    <strong>société par actions simplifiée (SAS)</strong>, en cours d’immatriculation au{' '}
                    <strong>Registre du Commerce et des Sociétés (RCS) de Montpellier</strong>.
                  </p>
                  <p>
                    Le <strong>capital social</strong> de la SAS est fixé à <strong>1&nbsp;000&nbsp;€</strong>{' '}
                    (mille euros).
                  </p>
                  <p>
                    Conformément à l’article 6-III de la loi n°&nbsp;2004-575 du 21 juin 2004 (LCEN), seront
                    communiqués dès l’immatriculation effective : l’<strong>adresse du siège social</strong>, le
                    numéro <strong>SIREN</strong> et le <strong>SIRET</strong>, ainsi que le{' '}
                    <strong>numéro de TVA intracommunautaire</strong> le cas échéant (si la société est
                    assujettie).
                  </p>
                </div>
              </section>

              <section className="mentions-legales-block" aria-labelledby="ml-dp">
                <h2 id="ml-dp" className="mentions-legales-h2">
                  Directeur de la publication
                </h2>
                <div className="mentions-legales-block-body">
                  <p>
                    Le directeur de la publication est le <strong>représentant légal</strong> de MedicusLoop
                    SAS.
                  </p>
                </div>
              </section>

              <section className="mentions-legales-block" aria-labelledby="ml-hebergement">
                <h2 id="ml-hebergement" className="mentions-legales-h2">
                  Hébergement
                </h2>
                <div className="mentions-legales-block-body">
                  <p>
                    Cette landing page est hébergée par :
                  </p>
                  <div className="mentions-legales-vercel-card">
                    <address className="mentions-legales-address">
                      <strong className="mentions-legales-address-name">Vercel Inc.</strong>
                      <span className="mentions-legales-address-lines">
                        340 S Lemon Ave #4133
                        <br />
                        Walnut, CA 91789 — États-Unis
                      </span>
                      <a
                        href="https://vercel.com"
                        className="mentions-legales-address-site"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        vercel.com
                        <span className="material-symbols-outlined mentions-legales-external" aria-hidden="true">
                          open_in_new
                        </span>
                      </a>
                    </address>
                    <div className="mentions-legales-vercel-card__contacts">
                      <p className="mentions-legales-host-contact-intro">
                        Moyens de contacter l’hébergeur  :
                      </p>
                      <ul className="mentions-legales-host-links">
                        <li>
                          <a
                            href="https://vercel.com/help"
                            rel="noopener noreferrer"
                            target="_blank"
                            className="mentions-legales-host-link"
                          >
                            Centre d’aide &amp; support
                            <span className="material-symbols-outlined mentions-legales-external" aria-hidden="true">
                              open_in_new
                            </span>
                          </a>
                          <span className="mentions-legales-host-link-url">vercel.com/help</span>
                        </li>
                        <li>
                          <a
                            href="https://vercel.com/contact"
                            rel="noopener noreferrer"
                            target="_blank"
                            className="mentions-legales-host-link"
                          >
                            Formulaire de contact
                            <span className="material-symbols-outlined mentions-legales-external" aria-hidden="true">
                              open_in_new
                            </span>
                          </a>
                          <span className="mentions-legales-host-link-url">vercel.com/contact</span>
                        </li>
                        <li>
                          <a
                            href="https://vercel.com/legal"
                            rel="noopener noreferrer"
                            target="_blank"
                            className="mentions-legales-host-link"
                          >
                            Mentions légales &amp; politiques (Vercel)
                            <span className="material-symbols-outlined mentions-legales-external" aria-hidden="true">
                              open_in_new
                            </span>
                          </a>
                          <span className="mentions-legales-host-link-url">vercel.com/legal</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mentions-legales-callout" role="note">
                    <span className="mentions-legales-callout__icon material-symbols-outlined" aria-hidden="true">
                      info
                    </span>
                    <p>
                      <strong>Données de santé et infrastructure France :</strong> les traitements applicatifs et
                      l’hébergement des <strong>données de santé</strong> au sens réglementaire ne sont pas
                      assurés via Vercel. Un hébergement conforme aux exigences applicables (notamment référentiel{' '}
                      <abbr title="Hébergeurs de données de santé">HDS</abbr>) sur une infrastructure située en{' '}
                      <strong>France</strong> (datacenters <strong>OVHcloud</strong>) fait l’objet d’une{' '}
                      <strong>mise en œuvre en cours</strong>. La présente page ne constitue qu’une vitrine
                      d’information.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mentions-legales-block" aria-labelledby="ml-propriete">
                <h2 id="ml-propriete" className="mentions-legales-h2">
                  Propriété intellectuelle
                </h2>
                <div className="mentions-legales-block-body">
                  <p>
                    L’ensemble des éléments du Site (textes, visuels, logos, structure, etc.) sont protégés.
                    Toute reproduction ou représentation non autorisée est interdite.
                  </p>
                </div>
              </section>

              <section className="mentions-legales-block" aria-labelledby="ml-rgpd">
                <h2 id="ml-rgpd" className="mentions-legales-h2">
                  Données personnelles (RGPD)
                </h2>
                <div className="mentions-legales-block-body">
                  <p>
                    Dans le cadre de l’utilisation du Site et des services proposés (notamment inscription à la
                    liste d’attente ou formulaires), MedicusLoop est amenée à traiter des{' '}
                    <strong>données personnelles</strong>. Ces traitements sont réalisés conformément au{' '}
                    <strong>Règlement (UE) 2016/679</strong> du 27 avril 2016 (
                    <abbr title="Règlement général sur la protection des données">RGPD</abbr>) et à la loi «
                    Informatique et libertés ».
                  </p>
                  <p>
                    Vous disposez d’un <strong>droit d’accès</strong>, de <strong>rectification</strong>,
                    d’<strong>effacement</strong> (suppression), de <strong>limitation</strong> du traitement,
                    d’<strong>opposition</strong> et de <strong>portabilité</strong> des données, dans les conditions
                    prévues par la réglementation.
                  </p>
                  <p>
                    Pour exercer ces droits ou pour toute question relative au traitement de vos données
                    personnelles, vous pouvez contacter :{' '}
                    <MentionsLegalesContactMail variant="dpo" inline />
                    .
                  </p>
                  <p>
                    La désignation du <strong>délégué à la protection des données (DPO)</strong> et les formalités
                    associées auprès de la <strong>CNIL</strong> sont <strong>en cours</strong> ; vous pouvez
                    néanmoins adresser vos demandes à l’adresse ci-dessus, qui constitue le point de contact prévu
                    pour l’exercice de vos droits.
                  </p>
                  <p>
                    Vous pouvez introduire une <strong>réclamation auprès de la CNIL</strong> :{' '}
                    <a
                      href="https://www.cnil.fr"
                      rel="noopener noreferrer"
                      target="_blank"
                      className="mentions-legales-inline-mailto"
                    >
                      www.cnil.fr
                    </a>
                    .
                  </p>
                </div>
              </section>

              <section className="mentions-legales-block" aria-labelledby="ml-contact">
                <h2 id="ml-contact" className="mentions-legales-h2">
                  Contact
                </h2>
                <div className="mentions-legales-block-body">
                  <p>
                    Pour toute question relative au Site : <MentionsLegalesContactMail />
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
