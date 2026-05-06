import type { ReactNode } from 'react'
import Link from 'next/link'
import { PATH_MENTIONS_LEGALES } from '@/lib/legal-routes'

const ILLUSTRATIVE_QUOTES = [
  {
    quote:
      'Enfin un discours qui colle au bloc : forfait, spécialité, équipe IADE — pas une annonce floue. Si le contrat sort vraiment en un clic, ça change la semaine.',
    role: 'MAR remplaçant',
    region: 'Grand Est',
    initials: 'A. M.',
  },
  {
    quote:
      'Ce qu’on attend, c’est moins de no-show et des engagements écrits avant J-1. Si les relances sont automatisées et le profil vérifié, on peut tester.',
    role: 'Coordination bloc · clinique privée',
    region: 'Occitanie',
    initials: 'C. R.',
  },
  {
    quote:
      'L’angle « expérience » autour de la mission, je trouve ça malin — à condition que le cœur (match + contrat) soit solide. On verra sur la première vague.',
    role: 'MAR · activité mixte',
    region: 'Pays de la Loire',
    initials: 'L. T.',
  },
] as const

const FAQ_ITEMS: { q: string; a: ReactNode }[] = [
  {
    q: 'Le matching est-il vraiment adapté au MAR et au bloc opératoire ?',
    a: (
      <>
        Le moteur croise des critères opérationnels (spécialité, type de chirurgie, forfait journalier, zone,
        disponibilités, préférences IADE / matériel) — pas seulement une ville et une date. Les premiers retours
        Pionniers servent à affiner les pondérations avant ouverture large.
      </>
    ),
  },
  {
    q: 'Comment sont rédigés les contrats de remplacement ?',
    a: (
      <>
        MedicusLoop génère des contrats à partir de modèles validés juridiquement, adaptés au cadre du remplacement
        libéral ; la signature électronique est intégrée au parcours.
      </>
    ),
  },
  {
    q: 'MedicusLoop est-il gratuit pour les MAR ?',
    a: (
      <>
        Oui : <strong className="ml-text-strong">aucun frais pour le MAR en remplacement</strong> sur le matching, le
        contrat et la LoopExpérience. La rémunération de la plateforme repose sur les établissements, selon le barème
        affiché dans la section Tarifs.
      </>
    ),
  },
  {
    q: 'Qu’en est-il des données personnelles et de la santé ?',
    a: (
      <>
        Les données d’inscription sont traitées conformément au RGPD ; les finalités, bases légales et durées sont
        précisées dans les{' '}
        <Link href={PATH_MENTIONS_LEGALES} className="ml-faq-inline-link">
          mentions légales
        </Link>
        . À ce stade, nous ne collectons pas de données de santé au sens réglementaire : uniquement identité, contact et
        éléments de profil utiles au matching. Nous faisons néanmoins le choix d’héberger la future plateforme chez des{' '}
        <strong className="ml-text-strong">prestataires certifiés HDS</strong> dès la construction du produit — pour
        coller aux exigences des établissements, éviter une migration lourde lorsque le périmètre s’élargira, et garantir
        un socle de sécurité adapté au secteur dès le départ.
      </>
    ),
  },
  {
    q: 'À quel stade du projet êtes-vous ?',
    a: (
      <>
        La landing reflète le produit en construction : le programme <strong className="ml-text-strong">Pionniers</strong>{' '}
        permet de figer des avantages pour les premiers établissements et de calibrer le matching avec des profils
        réels avant le lancement public.
      </>
    ),
  },
  {
    q: 'La LoopExpérience est-elle obligatoire ?',
    a: (
      <>
        Non : c’est un volet d’accompagnement autour du lieu de mission (hébergement, tables, culture). Le cœur du
        service reste le <strong className="ml-text-strong">match</strong> et le{' '}
        <strong className="ml-text-strong">contrat</strong> ; la LoopExpérience vise à valoriser le temps hors bloc.
      </>
    ),
  },
]

export default function PreuveFaqSection() {
  return (
    <section
      className="ml-preuve-faq-section"
      aria-labelledby="preuve-sociale-title"
    >
      <div className="ml-section-max">
        <header className="ml-section-head-center ml-preuve-head" data-reveal>
          <h2 id="preuve-sociale-title" className="font-fraunces ml-title-hero comparatif-head-title ml-section-h2-tight">
            <span className="comparatif-head-title__line">Ce que disent les premiers échanges</span>
            <span className="comparatif-head-title__accent">
              <span className="profils-mar-title-verb profils-mar-title-verb--rem">Avant même le lancement public.</span>
            </span>
            <span className="comparatif-head-title__rule" aria-hidden="true" />
          </h2>
          <p className="ml-section-lead">
            Commentaires reformulés à partir de discussions avec des MAR et des établissements (salons, entretiens,
            pré-inscriptions).
          </p>
        </header>

        <div className="ml-preuve-quotes-grid" data-stagger>
          {ILLUSTRATIVE_QUOTES.map((t) => (
            <blockquote key={t.initials} className="ml-preuve-quote glass card-hover">
              <p className="ml-preuve-quote__text">&laquo;&nbsp;{t.quote}&nbsp;&raquo;</p>
              <footer className="ml-preuve-quote__footer">
                <span className="ml-preuve-quote__avatar" aria-hidden="true">
                  {t.initials}
                </span>
                <div className="ml-preuve-quote__meta">
                  <cite className="ml-preuve-quote__role">{t.role}</cite>
                  <span className="ml-preuve-quote__region">{t.region}</span>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>

        <div className="ml-faq-block" id="faq" data-reveal>
          <header className="ml-faq-head">
            <h2 className="font-fraunces ml-title-hero comparatif-head-title ml-section-h2-tight ml-faq-title">
              <span className="comparatif-head-title__line">Questions fréquentes</span>
            </h2>
            <p className="ml-section-lead ml-faq-lead">
              Les objections qu’on se fait avant de s’inscrire — réponses synthétiques ; le détail juridique est dans les
              pages dédiées.
            </p>
          </header>
          <div className="ml-faq-list">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="ml-faq-details">
                <summary className="ml-faq-summary">{item.q}</summary>
                <div className="ml-faq-answer">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
