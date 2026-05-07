'use client'

import { useCallback, useEffect, useState } from 'react'
import PionnierCtaStrip from './pionnier-cta-strip'

type ProfilTab = 'remplacant' | 'etablissement'

const POINTS_REMPLACANT = [
  {
    icon: 'visibility',
    title: 'Critères avant engagement',
    text: 'Spécialités, forfait, secteur, type de bloc — ce qui conditionne le rempla est visible avant que vous ne signiez.',
  },
  {
    icon: 'contract',
    title: 'Contrat puis signature électronique',
    text: "Document généré à partir d'un modèle relu en droit médical libéral ; signature électronique, versions archivées. Identité professionnelle vérifiée avant toute mise en relation avec un établissement.",
  },
  {
    icon: 'redeem',
    title: 'Gratuit + LoopExpérience',
    text: "Aucune commission côté MAR ; accès à l'accompagnement séjour (hôtels, tables, loisirs) : recommandations par intelligence artificielle à partir de votre profil et de vos envies.",
  },
] as const

const POINTS_ETABLISSEMENT = [
  {
    icon: 'schedule',
    title: 'Temps gagné',
    text: "Titulaire, secrétariat ou RH : moins d'allers-retours téléphoniques et de relances manuelles pour sécuriser chaque rempla.",
  },
  {
    icon: 'assignment_turned_in',
    title: 'Désistements maîtrisés',
    text: 'Relances automatiques et engagements tracés avant le jour J — moins de surprise au bloc.',
  },
  {
    icon: 'fact_check',
    title: 'Traçabilité',
    text: 'Contrat signé électroniquement, profil MAR vérifié côté identité professionnelle, historique des étapes.',
  },
] as const

const TAB_REM = 'profils-mar-tab-remplacant'
const TAB_STR = 'profils-mar-tab-etablissement'
const PANEL_REM = 'profils-mar-panel-remplacant'
const PANEL_STR = 'profils-mar-panel-etablissement'

type ProfilsMarSectionProps = {
  listePleinePionniers?: boolean
}

export default function ProfilsMarSection({ listePleinePionniers = false }: ProfilsMarSectionProps) {
  const [tab, setTab] = useState<ProfilTab>('remplacant')

  const applyHash = useCallback(() => {
    const h = window.location.hash
    if (h === '#profils-etablissement' || h === '#profils-titulaire') {
      setTab('etablissement')
      return
    }
    if (h === '#profils-remplacant') {
      setTab('remplacant')
      return
    }
    if (h === '#profils') {
      setTab('remplacant')
    }
  }, [])

  useEffect(() => {
    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [applyHash])

  const scrollProfilTabsIntoView = useCallback(() => {
    const el = document.getElementById('profils-mar-tabs-top')
    if (!el) return
    const instant = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: instant ? 'auto' : 'smooth', block: 'start' })
  }, [])

  const selectRemFromEndcap = useCallback(() => {
    setTab('remplacant')
    scrollProfilTabsIntoView()
  }, [scrollProfilTabsIntoView])

  const selectEtabFromEndcap = useCallback(() => {
    setTab('etablissement')
    scrollProfilTabsIntoView()
  }, [scrollProfilTabsIntoView])

  return (
    <section id="profils" className="profils-mar" aria-labelledby="profils-mar-title">
      <div className="profils-mar-inner">
        <header className="profils-mar-head" data-reveal>
          <h2 id="profils-mar-title" className="profils-mar-title font-fraunces">
            <span className="profils-mar-title-display">
              Vous voulez{' '}
              <span className="profils-mar-title-verb profils-mar-title-verb--rem">faire un rempla</span>
              <span className="profils-mar-title-punct">, </span>
              ou vous{' '}
              <span className="profils-mar-title-verb profils-mar-title-verb--acc">avez besoin d&apos;un</span>{' '}
              <span className="profils-mar-title-verb profils-mar-title-verb--mar">MAR</span>
            </span>
          </h2>
          <p className="ml-section-lead">
            Même parcours pour les <strong>MAR remplaçant</strong> et pour ceux qui portent le besoin côté bloc —{' '}
            <strong>titulaire</strong> (remplacé), membre d&apos;équipe ou <strong>établissement</strong> : critères et
            contrat lisibles avant le jour J, relances tracées — moins de désistements à la dernière minute ou sans
            nouvelle, plus de simplicité côté agenda, RH et bloc.
          </p>
        </header>

        <div
          id="profils-mar-tabs-top"
          className="profils-mar-tablist"
          role="tablist"
          aria-label="Choisissez votre profil : MAR remplaçant, ou titulaire et établissement côté besoin MAR"
          data-reveal
        >
          <button
            type="button"
            role="tab"
            id={TAB_REM}
            aria-selected={tab === 'remplacant'}
            aria-controls={PANEL_REM}
            tabIndex={tab === 'remplacant' ? 0 : -1}
            className={`profils-mar-tab${tab === 'remplacant' ? ' profils-mar-tab--active' : ''}`}
            onClick={() => setTab('remplacant')}
          >
            MAR remplaçant
          </button>
          <button
            type="button"
            role="tab"
            id={TAB_STR}
            aria-selected={tab === 'etablissement'}
            aria-controls={PANEL_STR}
            tabIndex={tab === 'etablissement' ? 0 : -1}
            className={`profils-mar-tab${tab === 'etablissement' ? ' profils-mar-tab--active' : ''}`}
            onClick={() => setTab('etablissement')}
          >
            Titulaire ou établissement
          </button>
        </div>

        <div
          id={PANEL_REM}
          role="tabpanel"
          aria-labelledby={TAB_REM}
          hidden={tab !== 'remplacant'}
          className="profils-mar-panel"
        >
          <div className="profils-mar-panel-head">
            <h3 className="etablissement-mar-title font-fraunces">
              Votre rempla MAR, lisible avant la signature
            </h3>
            <p className="etablissement-mar-lead">
              Critères, contrat, relances jusqu&apos;au jour J : tout est factuel — vous tranchez à partir du dossier,
              pas à coups d&apos;allers-retours entre secrétariat et bloc.
            </p>
          </div>
          <div className="etablissement-mar-grid">
            {POINTS_REMPLACANT.map((p) => (
              <article key={p.title} className="etablissement-mar-card">
                <div className="etablissement-mar-icon profils-mar-card-icon" aria-hidden="true">
                  <span className="material-symbols-outlined">{p.icon}</span>
                </div>
                <h3 className="etablissement-mar-card-title">{p.title}</h3>
                <p className="etablissement-mar-card-text">{p.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div
          id={PANEL_STR}
          role="tabpanel"
          aria-labelledby={TAB_STR}
          hidden={tab !== 'etablissement'}
          className="profils-mar-panel"
        >
          <div className="profils-mar-panel-head">
            <h3 className="etablissement-mar-title font-fraunces">
              Votre besoin MAR — titulaire remplacé ou équipe hospitalière
            </h3>
            <p className="etablissement-mar-lead">
              Que vous soyez <strong>titulaire</strong> à faire remplacer (sans parler au nom de toute la structure) ou{' '}
              <strong>établissement</strong> : dossier, confirmations et historique des échanges restent liés au rempla
              MAR, avec la même vue côté demande et pour le MAR qui signe au bloc.
            </p>
          </div>
          <div className="etablissement-mar-grid">
            {POINTS_ETABLISSEMENT.map((p) => (
              <article key={p.title} className="etablissement-mar-card">
                <div className="etablissement-mar-icon profils-mar-card-icon" aria-hidden="true">
                  <span className="material-symbols-outlined">{p.icon}</span>
                </div>
                <h3 className="etablissement-mar-card-title">{p.title}</h3>
                <p className="etablissement-mar-card-text">{p.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div
          className="profils-mar-tablist profils-mar-tablist--endcap"
          role="group"
          aria-label="Raccourci : même choix MAR remplaçant ou titulaire / établissement qu’en haut de section ; le clic remonte pour afficher le contenu depuis le début"
        >
          <button
            type="button"
            aria-pressed={tab === 'remplacant'}
            className={`profils-mar-tab${tab === 'remplacant' ? ' profils-mar-tab--active' : ''}`}
            onClick={selectRemFromEndcap}
          >
            MAR remplaçant
          </button>
          <button
            type="button"
            aria-pressed={tab === 'etablissement'}
            className={`profils-mar-tab${tab === 'etablissement' ? ' profils-mar-tab--active' : ''}`}
            onClick={selectEtabFromEndcap}
          >
            Titulaire ou établissement
          </button>
        </div>

        <PionnierCtaStrip listePleinePionniers={listePleinePionniers} withShareInvite={false} />
      </div>
    </section>
  )
}
