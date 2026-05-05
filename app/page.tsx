import Image from 'next/image'
import { getWaitlistPionniersCount } from '@/lib/waitlist-pionniers-count'
import { PIONNIER_PLACES_TOTAL } from '@/lib/pionnier-constants'
import FounderCounter from './_components/urgence-section'
import FormulaireSection from './_components/formulaire-section'
import PageAnimations from './_components/page-animations'
import HeroCards from './_components/hero-cards'
import MedicusLoopLogo from './_components/medicusloop-logo'
import Navbar from './_components/site-navbar'
import HeroTrustBlock from './_components/trust-strip'
import ProfilsMarSection from './_components/profils-mar-section'
import PionnierCtaStrip from './_components/pionnier-cta-strip'
import SharePublicSection from './_components/share-public-section'
import FooterShare from './_components/footer-share'

// ─── Grain SVG (id de filtre unique par instance — évite artefacts / « lignes » avec plusieurs SVG) ───

function GrainSvg({ filterSuffix }: { filterSuffix: string }) {
  const fid = `ml-grain-${filterSuffix}`
  return (
    <svg
      className="grain-overlay"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      aria-hidden="true"
    >
      <filter id={fid}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves={3}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${fid})`} />
    </svg>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero({ placesPrises }: { placesPrises: number }) {
  const listePleineBadge = placesPrises >= PIONNIER_PLACES_TOTAL
  const heroPionniersBadgeAria = listePleineBadge
    ? 'Inscrivez-vous pour être tenu au courant de la date officielle de lancement. Aller à l’inscription.'
    : 'Inscrivez-vous et devenez l’un des 50 premiers pionniers pour bénéficier d’avantages exclusifs. Aller à l’inscription.'
  const heroPionniersBadgeText = listePleineBadge
    ? 'Inscrivez-vous pour être tenu au courant de la date officielle de lancement.'
    : 'Inscrivez-vous et devenez l’un des 50 premiers pionniers pour bénéficier d’avantages exclusifs.'

  return (
    <header className="ml-hero" aria-label="MedicusLoop — présentation">
      <div className="ml-hero-deco-wrap" aria-hidden="true">
        <div className="orb-blue" />
        <div className="orb-violet" />
        <GrainSvg filterSuffix="hero" />
      </div>

      <div className="ml-hero-inner">

      {/* Invitation programme Pionniers (lien #inscription) */}
      <div className="fade-in-1 float-gentle hero-pionniers-badge-wrap">
        <a
          href="#inscription"
          className="hero-pionniers-badge-link"
          aria-label={heroPionniersBadgeAria}
        >
          {!listePleineBadge ? (
            <span className="material-symbols-outlined hero-pionniers-badge-link__seal" aria-hidden="true">
              verified
            </span>
          ) : null}
          <span>{heroPionniersBadgeText}</span>
          <span className="material-symbols-outlined" aria-hidden="true">
            arrow_forward
          </span>
        </a>
      </div>

      {/* Layout 2 colonnes */}
      <div className="hero-grid ml-hero-grid">
        {/* ─ Colonne texte ─ */}
        <div className="hero-text-col">

          {/* H1 */}
          <h1
            className="font-fraunces fade-in-2 ml-hero-h1"
            aria-label="Remplacement MAR en clinique privée — Un bloc, un remplacement MAR, une expérience"
          >
            Un bloc,<br />
            un{' '}
            <span className="hero-gradient-text">remplacement MAR</span>
            ,<br />
            une{' '}
            <span className="hero-gradient-text">expérience</span>.
          </h1>

          {/* Badges spécialités / missions MAR */}
          <div className="fade-in-3 hero-spec-badges-row">
            {[
              { label: 'AG', mod: 'hero-spec-badge--ag' as const },
              { label: 'ALR', mod: 'hero-spec-badge--alr' as const },
              { label: 'Astreinte', mod: 'hero-spec-badge--astreinte' as const },
              { label: 'Garde', mod: 'hero-spec-badge--garde' as const },
              { label: 'Réanimation', mod: 'hero-spec-badge--rea' as const },
            ].map((s) => (
              <span key={s.label} className={`hero-spec-badge ${s.mod}`}>
                <span className="hero-spec-badge__dot" aria-hidden="true" />
                {s.label}
              </span>
            ))}
          </div>

          {/* Pitch : marque + mots-clés en gras (couleur --text = lisible en clair / sombre) */}
          <p className="fade-in-3 hero-pitch">
            <strong className="hero-pitch-brand">MedicusLoop</strong>{' '}
            <strong className="hero-pitch-brand">MAR</strong> croise votre profil avec les{' '}
            <strong className="hero-pitch-em">blocs</strong> qui vous correspondent —{' '}
            <strong className="hero-pitch-em">forfait journalier, spécialité, type de chirurgie</strong>
            {' '}— et génère le <strong className="hero-pitch-em">contrat de rempla en un clic</strong>. L’outil{' '}
            <strong className="hero-pitch-em">relance automatiquement du MAR</strong> pour sécuriser le{' '}
            <strong className="hero-pitch-em">planning</strong> et limiter les{' '}
            <strong className="hero-pitch-em">désistements silencieux</strong>.
          </p>

          {/* Confiance : juste après le pitch, avant les actions (rassurer puis proposer) */}
          <div className="hero-trust-slot fade-in-3">
            <HeroTrustBlock />
          </div>
        </div>

        {/* ─ Colonne cartes ─ */}
        <div className="hero-cards-col fade-in-4">
          <HeroCards />
        </div>

        {/* CTAs : pleine largeur du hero, centrés (sous les deux colonnes) */}
        <div className="hero-cta-row fade-in-4" role="group" aria-label="Accès inscription et sections clés">
          <div className="hero-cta-row-inner">
            <a
              href="?profil=remplacant#inscription"
              className="cta-primary-glow cta-glow-pulse hero-cta-primary"
              data-magnetic
              aria-label="S'inscrire en tant que MAR remplaçant"
            >
              <span className="material-symbols-outlined" aria-hidden="true">directions_run</span>
              Je remplace
              <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
            </a>
            <a
              href="?profil=etablissement#inscription"
              className="hero-cta-secondary"
              aria-label="S'inscrire en tant qu'établissement qui cherche un MAR"
            >
              <span className="material-symbols-outlined" aria-hidden="true">business</span>
              Je cherche un remplaçant
            </a>
          </div>
        </div>
      </div>

      </div>{/* fin wrapper colonne */}

    </header>
  )
}

// ─── Section Solution (contexte quotidien + démarche) ───────────────────────

function SolutionSection({ listePleinePionniers }: { listePleinePionniers: boolean }) {
  const problemCards = [
    {
      icon: 'schedule',
      title: 'Souvent au dernier moment',
      text: 'Le secrétariat appelle souvent sans marge pour anticiper — parfois dès la veille pour un bloc général le lendemain matin. Vous acceptez sans savoir quels IADEs vous attendent, quels chirurgiens opéreront, ni si les respirateurs sont ceux que vous maîtrisez.',
    },
    {
      icon: 'contract',
      title: 'Le forfait flou',
      text: "Négociation orale, PDF envoyé la veille sans signature. Forfait journalier annoncé à l'oral : 800 € ? 900 € ? Secteur 2 autorisé ? Votre comptable devra reconstituer ce qu'il pourra à partir de là.",
    },
    {
      icon: 'explore',
      title: "Première garde dans l'inconnu",
      text: "Protocoles inconnus, équipe étrangère, SSPI d'une clinique que vous n'avez jamais vue. Et une ville que vous ne connaissez pas. Cela aurait pu être une vraie expérience.",
    },
  ]

  const steps = [
    {
      icon: 'person',
      title: 'Votre profil en 3 minutes',
      text: 'Quelques minutes pour un profil complet : tout ce qui sert au match est renseigné en une fois.',
    },
    {
      icon: 'handshake',
      title: 'La mise en relation',
      text: 'Notre IA croise votre profil MAR — spécialités, zone, forfait journalier minimum, type de bloc et disponibilités — avec les besoins déclarés des établissements. Contrat de rempla généré automatiquement, pour une signature électronique.',
    },
    {
      icon: 'hotel',
      title: 'L’expérience',
      text: "Dès qu'un rempla vous est proposé, MedicusLoop vous montre votre LoopExpérience — hôtel négocié, tables sélectionnées, activités locales — en amont, avant signature ; la mission reste une vraie expérience pendant et après le bloc.",
    },
  ]

  const ccmRowIcon = (icon: string) => (
    <div className="ccm-row-icon-wrap" aria-hidden="true">
      <span className="material-symbols-outlined" aria-hidden="true">
        {icon}
      </span>
    </div>
  )

  return (
    <div
      id="comment-ca-marche"
      className="ccm-outer"
      aria-label="Comment ça marche : avant le quotidien, après avec MedicusLoop"
    >
      <div className="ccm-inner">
        <header className="ccm-head" data-reveal>
          <h2 id="comment-ca-marche-title" className="profils-mar-title font-fraunces">
            <span className="profils-mar-title-display">
              Comment{' '}
              <span className="profils-mar-title-verb profils-mar-title-verb--rem">ça marche</span>
            </span>
          </h2>
          <p className="ml-section-lead">
            Le <strong>quotidien</strong> du rempla (MAR ou établissement), puis la <strong>même vacation</strong> avec
            MedicusLoop MAR.
          </p>
        </header>

        <div className="ccm-compare-shell">
        <section
          id="probleme"
          className="ccm-compare-col ccm-compare-col--avant ccm-compare-col--bare"
          aria-labelledby="probleme-title"
        >
          <div className="ccm-probleme-inner">
            <GrainSvg filterSuffix="ccm" />
            <div className="ccm-probleme-stack">
              <div className="ccm-compare-col-head ccm-compare-col-head--mb" data-reveal>
                <p className="ccm-pill ccm-pill--muted">Avant</p>
                <h3 id="probleme-title" className="font-fraunces ml-title-block ccm-ml-title--tight">
                  Ce quotidien, côté MAR ou côté établissement ?
                </h3>
                <p className="ccm-compare-intro">
                  Le rempla en libéral tel qu&apos;il se vit au bloc — ce que l&apos;on vit à chaque rempla.
                </p>
              </div>
              <ul className="ccm-compare-steps-list" data-stagger>
                {problemCards.map((card) => (
                  <li key={card.title} className="glass card-hover ccm-compare-card">
                    <div className="ccm-compare-card__icon-title">
                      {ccmRowIcon(card.icon)}
                      <h4 className="ml-title-card">{card.title}</h4>
                    </div>
                    <p className="ccm-compare-card-body">{card.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="ccm-compare-divider" aria-hidden="true" />

        <section
          id="etapes-rempla"
          className="ccm-compare-col ccm-compare-col--bare"
          aria-labelledby="etapes-rempla-title"
        >
          <div className="ccm-etapes-inner">
            <div className="ccm-compare-col-head ccm-compare-col-head--mb" data-reveal>
              <p className="ccm-pill ccm-pill--accent">Après — MedicusLoop</p>
              <h3 id="etapes-rempla-title" className="font-fraunces ml-title-block ccm-ml-title--loose">
                Simple comme un match.
              </h3>
              <p className="ccm-compare-intro">
                Trois étapes — même logique pour le MAR en rempla et pour l&apos;établissement.
              </p>
            </div>

            <ul className="ccm-compare-steps-list" data-stagger>
              {steps.map((step) => (
                <li key={step.title} className="glass card-hover ccm-compare-card">
                  <div className="ccm-compare-card__icon-title">
                    {ccmRowIcon(step.icon)}
                    <h4 className="ml-title-card">{step.title}</h4>
                  </div>
                  {step.text && <p className="ccm-compare-card-body">{step.text}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>
        </div>
      </div>

      <PionnierCtaStrip listePleinePionniers={listePleinePionniers} />
    </div>
  )
}

// ─── Section Versus ──────────────────────────────────────────────────────────

function VersusSection({ listePleinePionniers }: { listePleinePionniers: boolean }) {
  const jobboardItems = [
    { icon: 'close', text: 'Une annonce publiée. Vous postulez dans le vide sans retour.' },
    { icon: 'close', text: 'Forfait négocié à la voix. PDF signé la veille.' },
    { icon: 'close', text: 'Aucune info sur les IADEs, le bloc ni les chirurgiens.' },
    { icon: 'close', text: 'Première garde dans un établissement que vous ne connaissez pas.' },
    { icon: 'close', text: 'Commission ou abonnement même si aucun rempla ne se concrétise.' },
    { icon: 'close', text: 'Désistement de dernière minute : aucun suivi, aucun recours.' },
  ]

  const interimItems = [
    { icon: 'close', text: "Jusqu'à 25-30 % de votre forfait journalier reversé à l'agence." },
    { icon: 'close', text: 'Vous ne choisissez pas votre mission — on vous place.' },
    { icon: 'close', text: 'Aucune transparence sur le bloc, les IADEs ni les conditions.' },
    { icon: 'close', text: "Contrat opaque, signé dans l'urgence, souvent le matin même." },
    { icon: 'close', text: 'Aucun suivi post-mission. Juste un numéro de dossier.' },
    { icon: 'close', text: 'Désistement ? Un e-mail. Pas de rempla, pas de solution.' },
  ]

  const medicusItems = [
    { icon: 'check_circle', text: 'Match algorithmique : spécialité, forfait journalier, secteur, ...' },
    { icon: 'check_circle', text: 'Contrat de rempla généré + signature électronique en 1 clic.' },
    { icon: 'check_circle', text: 'Profil MAR vérifié CNOM avant toute mise en relation.' },
    { icon: 'check_circle', text: 'Relances automatiques J-7, J-3, J-1 : confirmation de présence, zéro désistement surprise.' },
    { icon: 'check_circle', text: 'LoopExpérience (hôtels, tables, activités, ...) dès la proposition de mission.' },
    { icon: 'check_circle', text: 'Toujours gratuit pour les MAR en rempla.' },
  ]

  return (
    <section id="comparatif" className="comparatif-section" aria-labelledby="comparatif-title">
      <GrainSvg filterSuffix="comparatif" />
      <div className="ml-section-max">
        {/* Titre en tête de section */}
        <div className="ml-section-head-center" data-reveal>
          <h2 id="comparatif-title" className="font-fraunces ml-title-hero comparatif-head-title ml-section-h2-tight">
            <span className="comparatif-head-title__line">
              {"Pas un site d'annonces. Pas une agence d'intérim."}
            </span>
            <span className="comparatif-head-title__accent">
              <span className="profils-mar-title-verb profils-mar-title-verb--rem">
                MedicusLoop, le partenaire du rempla.
              </span>
            </span>
            <span className="comparatif-head-title__rule" aria-hidden="true" />
          </h2>
          <p className="ml-section-lead">
            Les annonces en ligne classiques sont potentiellement inadaptées. Les agences vous facturent. MedicusLoop
            vous&nbsp;accompagne
            jusqu&apos;au bout.
          </p>
        </div>

        {/* Comparaison 3 colonnes */}
        <div className="comparatif-vs-grid" data-stagger>
          {/* Colonne 1 : site d'annonces */}
          <div className="comparatif-vs-col--muted">
            <div className="comparatif-vs-head-block">
              <span className="comparatif-vs-pill comparatif-vs-pill--neutral">
                <span className="material-symbols-outlined" aria-hidden="true">
                  groups
                </span>
                Site d&apos;annonces
              </span>
              <p className="font-fraunces ml-title-block comparatif-vs-quote comparatif-vs-quote--muted">
                «&nbsp;Bonne chance au bloc.&nbsp;»
              </p>
            </div>

            <ul className="comparatif-vs-list">
              {jobboardItems.map((item, i) => (
                <li key={i} className="comparatif-vs-li">
                  <span className="material-symbols-outlined comparatif-vs-icon comparatif-vs-icon--warn" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="comparatif-vs-item-text comparatif-vs-item-text--job">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 2 : Agence intérim */}
          <div className="comparatif-vs-col--muted-soft">
            <div className="comparatif-vs-head-block">
              <span className="comparatif-vs-pill comparatif-vs-pill--neutral">
                <span className="material-symbols-outlined" aria-hidden="true">
                  business
                </span>
                Agence d&apos;intérim
              </span>
              <p className="font-fraunces ml-title-block comparatif-vs-quote comparatif-vs-quote--muted">
                &quot;On vous rappelle peut-être.&quot;
              </p>
            </div>

            <ul className="comparatif-vs-list">
              {interimItems.map((item, i) => (
                <li key={i} className="comparatif-vs-li">
                  <span className="material-symbols-outlined comparatif-vs-icon comparatif-vs-icon--subtle" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="comparatif-vs-item-text comparatif-vs-item-text--muted">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 : MedicusLoop */}
          <div className="comparatif-vs-col--positive">
            {/* Orbe de fond */}
            <div className="comparatif-vs-orb" aria-hidden="true" />

            <div className="comparatif-vs-head-block">
              <span className="comparatif-vs-pill comparatif-vs-pill--accent">
                <span className="material-symbols-outlined" aria-hidden="true">
                  verified
                </span>
                MedicusLoop
              </span>
              <p className="font-fraunces ml-title-block comparatif-vs-quote comparatif-vs-quote--strong">
                «&nbsp;On s&apos;occupe de tout.&nbsp;»
              </p>
            </div>

            <ul className="comparatif-vs-list comparatif-vs-list--lifted">
              {medicusItems.map((item, i) => (
                <li key={i} className="comparatif-vs-li">
                  <span className="material-symbols-outlined comparatif-vs-icon comparatif-vs-icon--ok" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="comparatif-vs-item-text comparatif-vs-item-text--text">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
      <PionnierCtaStrip listePleinePionniers={listePleinePionniers} />
    </section>
  )
}

// ─── Section LoopExperience Premium ───────────────────────────────────────────────

function LoopExperienceSection({ listePleinePionniers }: { listePleinePionniers: boolean }) {
  const interests = [
    { icon: 'hotel', label: 'Hébergement', active: true },
    { icon: 'restaurant', label: 'Gastronomie', active: true },
    { icon: 'explore', label: 'Outdoor & Nature', active: false },
    { icon: 'favorite', label: 'Bien-être & Spa', active: true },
    { icon: 'directions_run', label: 'Sport & Aventure', active: false },
    { icon: 'groups', label: 'Spectacles & Scènes', active: true },
    { icon: 'location_on', label: 'Monuments & Sites', active: false },
    { icon: 'person', label: 'Cinéma & Festivals', active: false },
    { icon: 'medical_services', label: 'Musées & Expos', active: true },
  ]

  const experiences = [
    {
      category: 'Hébergement',
      icon: 'hotel',
      name: 'Maison Thalie',
      detail: 'Chambre silencieuse, parking couvert, petit-déjeuner dès 6h30.',
      tag: 'Séjour',
      color: 'var(--accent-blue)',
      image: '/images/loopexperience/hotel.jpg',
    },
    {
      category: 'Gastronomie',
      icon: 'restaurant',
      name: 'L’Atelier Verdoise',
      detail: 'Carte courte du marché, accord mets-vins et service discret.',
      tag: 'Table haute',
      color: 'var(--accent-blue)',
      image: '/images/loopexperience/gastronomie.jpg',
    },
    {
      category: 'Bien-être',
      icon: 'favorite',
      name: 'Spa Les Sources du Parc',
      detail: 'Massage ciblé dos & nuque, sauna doux et tisanerie.',
      tag: 'Détente',
      color: 'var(--accent-blue)',
      image: '/images/loopexperience/spa.jpg',
    },
    {
      category: 'Musées',
      icon: 'museum',
      name: 'Musée des Lumières',
      detail: 'Parcours court et audioguide discret.',
      tag: 'Exposition',
      color: 'var(--accent-blue)',
      image: '/images/loopexperience/musee-hall.jpg',
    },
  ]

  return (
    <section id="loopexperience" className="loopexperience-section" aria-labelledby="loopexperience-title">
      {/* Orbes fond */}
      <div className="loopexperience-orb loopexperience-orb--blue" aria-hidden="true" />
      <div className="loopexperience-orb loopexperience-orb--gold" aria-hidden="true" />

      <div className="ml-section-max">
        <header className="profils-mar-head" data-reveal>
          <h2 id="loopexperience-title" className="profils-mar-title font-fraunces">
            <span className="profils-mar-title-display">
              Signature{' '}
              <span className="profils-mar-title-verb profils-mar-title-verb--rem">LoopExpérience</span>
            </span>
          </h2>
          <p className="ml-section-lead">
            Dès qu&apos;une mission vous est proposée : hôtels, tables, culture — recommandations liées à vos centres d&apos;intérêt et à votre profil.
          </p>
        </header>
        {/* Bloc commun : (titre + texte | exemples) puis 4 cartes pleine largeur */}
        <div className="loopexperience-split-shell">
          <div className="loopexperience-split-grid">
          <div className="loopexperience-split-top">
          {/* Colonne gauche : titre puis description, empilés */}
          <div data-reveal className="loopexperience-split-lead">
            <h3 className="font-fraunces ml-title-hero loopexperience-split-lead__title">
              L’expérience fait partie
              <br />
              <span className="profils-mar-title-verb profils-mar-title-verb--rem">de la mission.</span>
            </h3>

            <p className="loopexperience-split-lead__text">
              Dès qu&apos;un rempla vous est proposé, MedicusLoop vous montre ce qu&apos;il y a à vivre autour du lieu de mission — hôtels négociés, tables sélectionnées, sorties culturelles, activités outdoor, spectacles, musées, cinéma, balades — avec des{' '}
              <strong className="ml-text-strong">recommandations par intelligence artificielle</strong>
              {' '}à partir de votre profil et de vos centres d&apos;intérêt : vous voyez l&apos;expérience avant même d&apos;avoir signé.
            </p>
          </div>

          {/* Colonne droite : pastilles d’exemple + note */}
          <div data-reveal className="loopexperience-split-examples">
            <p className="loopexperience-split-examples__label">
              Vos centres d&apos;intérêt (exemple)
            </p>
            <div className="loopexperience-interest-pills">
              {interests.map((interest) => (
                <span
                  key={interest.label}
                  className={`loopexperience-interest-pill${interest.active ? ' loopexperience-interest-pill--active' : ' loopexperience-interest-pill--inactive'}`}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {interest.icon}
                  </span>
                  {interest.label}
                </span>
              ))}
            </div>
          </div>
          </div>

          {/* 4 cartes sur une ligne (2×2 puis 1 col sur écrans étroits) */}
          <div className="loopexperience-exp-grid" data-stagger>
            {experiences.map((exp) => (
              <article key={exp.name} data-tilt className="loopexperience-card">
                <div className="loopexperience-card-media">
                  <Image
                    src={exp.image}
                    alt={`Exemple visuel — ${exp.category} : ${exp.name}`}
                    fill
                    sizes="(max-width: 520px) 100vw, (max-width: 960px) 50vw, 25vw"
                    className="loopexperience-card-img"
                  />
                  <div className="loopexperience-card-media-accent" aria-hidden="true" />
                  <div className="loopexperience-card-media-scrim" aria-hidden="true" />
                  <span className="loopexperience-card-tag">{exp.tag}</span>
                </div>
                <div className="loopexperience-card-body">
                  <div className="loopexperience-card-meta">
                    <div className="loopexperience-card-icon" aria-hidden="true">
                      <span className="material-symbols-outlined" aria-hidden="true">
                        {exp.icon}
                      </span>
                    </div>
                    <p className="loopexperience-card-category">{exp.category}</p>
                  </div>
                  <h3 className="loopexperience-card-title font-fraunces">{exp.name}</h3>
                  <p className="loopexperience-card-detail">{exp.detail}</p>
                </div>
              </article>
            ))}
          </div>
          </div>
        </div>
      </div>
      <PionnierCtaStrip listePleinePionniers={listePleinePionniers} />
    </section>
  )
}

// ─── Section Pionniers (avantages programme) ─────────────────────────────────

function PionniersSection({ placesPrises }: { placesPrises: number }) {
  const avantages = [
    {
      icon: 'groups',
      title: 'Vous co-construisez la plateforme',
      text: "Accès direct à l'équipe fondatrice. Vous testez les nouvelles fonctionnalités en avant-première, votez sur les features ; vos retours du terrain guident chaque évolution de MedicusLoop.",
    },
    {
      icon: 'contract',
      title: 'Commission divisée par 2',
      text: "Sur les premières mises en relation avec un MAR, les établissements Pionniers paient la moitié du tarif standard — garantie contractuelle à vie sur cette réduction, même si le barème standard évolue.",
    },
    {
      icon: 'verified',
      title: 'Badge Membre Pionnier',
      text: "Votre profil affiche le badge Membre Pionnier. Signal de confiance fort pour vos pairs : vous avez cru au projet en avant-première. Ce badge ne sera jamais redistribué.",
    },
  ]

  const listePleine = placesPrises >= PIONNIER_PLACES_TOTAL

  return (
    <section
      id="pionniers"
      className="pionniers-section"
      aria-labelledby="pionniers-title"
    >
      {/* Orbe vert fond */}
      <div className="pionniers-orb" aria-hidden="true" />

      <div className="ml-section-max">
        {/* Titre de section (même logique que Comparatif) : accroche + trait vert + lead ; puis compteur */}
        <div className="ml-section-head-center" data-reveal>
          <h2 id="pionniers-title" className="font-fraunces ml-title-hero comparatif-head-title ml-section-h2-tight">
            <span className="comparatif-head-title__line">Vous ne rejoignez pas une simple file d&apos;attente.</span>
            <span className="comparatif-head-title__accent">
              <span className="profils-mar-title-verb profils-mar-title-verb--rem">Vous êtes au premier bloc.</span>
            </span>
            <span className="pionniers-head-title__rule" aria-hidden="true" />
          </h2>
          <p className="ml-section-lead">
            Les 50 premiers inscrits ont un statut à part. La réduction de commission qu&apos;ils cherchent et les
            nombreux autres avantages sont figés par contrat.
          </p>
        </div>

        <FounderCounter placesPrises={placesPrises} inviterButtonId="pionniers-inviter-confrere" />

        {listePleine ? (
          <div
            className="pionniers-avantage-ferme-lead pionniers-avantage-ferme-lead--section-bleed"
            data-reveal
            role="status"
          >
            <span className="pionniers-avantage-ferme-lead__icon" aria-hidden="true">
              <span className="material-symbols-outlined">info</span>
            </span>
            <p className="pionniers-avantage-ferme-lead__text">
              Les trois avantages ci-dessous étaient réservés aux 50 premiers inscrits — la liste Pionniers est complète
              : ils ne sont plus proposés aux nouvelles inscriptions.
            </p>
          </div>
        ) : null}

        {/* Cards avantages : 3 colonnes sur une ligne quand la place le permet */}
        <div
          className={`pionniers-avantage-grid${listePleine ? ' pionniers-avantage-grid--section-bleed' : ''}`}
          data-stagger
          {...(listePleine
            ? {
                role: 'group',
                'aria-label':
                  'Avantages historiques du programme Pionniers, liste complète — non disponibles pour une nouvelle inscription',
              }
            : {})}
        >
          {avantages.map((a) => (
              <article
                key={a.title}
                className={`pionniers-avantage-card${listePleine ? ' pionniers-avantage-card--liste-pleine' : ' pionniers-avantage-card--interactive card-hover'}`}
                {...(!listePleine ? { 'data-tilt': '' as const } : {})}
              >
                <div
                  className={`pionniers-avantage-card-icon${a.icon === 'verified' ? ' pionniers-avantage-card-icon--pionnier-seal' : ''}`}
                  aria-hidden="true"
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {a.icon}
                  </span>
                </div>
                <h3 className="pionniers-avantage-card-title">{a.title}</h3>
                <p className="pionniers-avantage-card-text">{a.text}</p>
              </article>
            ))}
        </div>

        <SharePublicSection embedded />
      </div>
      <PionnierCtaStrip listePleinePionniers={listePleine} inviterButtonId="pionniers-inviter-confrere" />
    </section>
  )
}

// ─── Section Tarifs (grille MAR / établissement / Pionnier) ──────────────────

function TarifsSection({ placesPrises }: { placesPrises: number }) {
  const listePleine = placesPrises >= PIONNIER_PLACES_TOTAL

  return (
    <section id="tarifs" className="tarifs-section" aria-labelledby="tarifs-title">
      <div className="ml-section-max">
        <header className="profils-mar-head" data-reveal>
          <h2 id="tarifs-title" className="profils-mar-title font-fraunces">
            <span className="profils-mar-title-display">
              Une{' '}
              <span className="profils-mar-title-verb profils-mar-title-verb--rem">transparence des tarifs</span>
              {' '}sans zone grise
            </span>
          </h2>
          <p className="ml-section-lead">
            MAR en rempla, établissement au tarif standard ou Pionnier :{' '}
            <strong className="ml-text-strong">qui paie quoi</strong> est dans le tableau ci-dessous. Le barème exact et les cas particuliers (récurrent, longue durée, etc.) sont au contrat.
          </p>
        </header>

        <div className="tarifs-pricing-shell" data-reveal aria-label="Grille tarifaire">
          <div className="tarifs-pricing-grid">
            {/* MAR en rempla */}
            <div className="tarifs-pricing-col">
              <div className="tarifs-pricing-col-head">
                <span className="tarifs-pricing-col-label-badge" aria-hidden="true">
                  <span className="material-symbols-outlined">person</span>
                </span>
                <span className="tarifs-pricing-col-label-text">MAR en rempla</span>
              </div>
              <p className="font-fraunces tarifs-pricing-price tarifs-pricing-price--mar">
                0 €
              </p>
              <p className="tarifs-pricing-col-lead">
                <strong>Gratuit à vie. Sans conditions. Toujours.</strong>
              </p>
              <ul className="tarifs-pricing-features">
                {['Matching illimité', 'Contrat de rempla automatique', 'LoopExpérience inclus', 'Vérification CNOM incluse'].map((f) => (
                  <li key={f}>
                    <span className="material-symbols-outlined tarifs-pricing-feature-icon tarifs-pricing-feature-icon--blue" aria-hidden="true">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Établissement tarif standard */}
            <div className={`tarifs-pricing-col${listePleine ? ' tarifs-pricing-col--std-actif' : ''}`}>
              <div className="tarifs-pricing-col-head">
                <span className="tarifs-pricing-col-label-badge" aria-hidden="true">
                  <span className="material-symbols-outlined">business</span>
                </span>
                <span className="tarifs-pricing-col-label-text">Établissement · Tarif standard</span>
              </div>
              <p className="font-fraunces tarifs-pricing-price tarifs-pricing-price--std">
                6%
              </p>
              <p className="tarifs-pricing-col-lead">
                <strong>sur les premières mises en relation.</strong>
              </p>
              <ul className="tarifs-pricing-features">
                {['Sans abonnement', 'Pas de frais fixes', 'Facturation post-mission', 'Résiliation à tout moment'].map((f) => (
                  <li key={f}>
                    <span className="material-symbols-outlined tarifs-pricing-feature-icon tarifs-pricing-feature-icon--blue" aria-hidden="true">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Établissement · Tarif Pionnier */}
            <div
              className={`tarifs-pricing-col tarifs-pricing-col--pionnier${listePleine ? ' tarifs-pricing-col--pionnier-epuise' : ''}`}
            >
              <div
                className={`tarifs-pricing-col-inner${listePleine ? ' tarifs-pricing-col-inner--liste-pleine-dim' : ''}`}
              >
                <div className="tarifs-pricing-col-head tarifs-pricing-col-head--pionnier">
                  <span className="tarifs-pricing-col-label-badge tarifs-pricing-col-label-badge--pionnier" aria-hidden="true">
                    <span className="material-symbols-outlined tarifs-pricing-col-label-badge__icon--verified">verified</span>
                  </span>
                  <span className="tarifs-pricing-col-label-text">Établissement · Tarif Pionnier</span>
                </div>
                <div className="tarifs-pricing-price-row">
                  <p className="font-fraunces tarifs-pricing-price tarifs-pricing-price--pionnier">
                    3%
                  </p>
                  <p className="tarifs-pricing-price-struck">6%</p>
                </div>
                <p className="tarifs-pricing-col-lead tarifs-pricing-col-lead--pionnier">
                  <strong>sur les premières mises en relation.</strong>
                </p>
                <ul className="tarifs-pricing-features tarifs-pricing-features--pionnier">
                  {['Barème standard inclus', 'Réduction pour la 1re mise en relation', 'Co-construction de la plateforme', 'Badge Pionnier à vie'].map((f) => (
                    <li key={f}>
                      <span className="material-symbols-outlined tarifs-pricing-feature-icon tarifs-pricing-feature-icon--pionnier" aria-hidden="true">check_circle</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              {listePleine ? (
                <div className="tarifs-pricing-pionnier-epuise-banner" role="region" aria-labelledby="tarifs-pionnier-epuise-title">
                  <div className="tarifs-pricing-pionnier-epuise-banner__head">
                    <span className="tarifs-pricing-pionnier-epuise-banner__icon" aria-hidden="true">
                      <span className="material-symbols-outlined">notifications_active</span>
                    </span>
                    <p id="tarifs-pionnier-epuise-title" className="tarifs-pricing-pionnier-epuise-banner__title">
                      Liste Pionniers complète.
                    </p>
                  </div>
                  <p className="tarifs-pricing-pionnier-epuise-banner__text">
                    Inscrivez-vous pour être tenu au courant de la{' '}
                    <strong>date officielle de lancement</strong>.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div
          className="tarifs-pricing-notes-wrap"
          data-reveal
          role="region"
          aria-label="Règles communes aux établissements"
        >
          <div className="tarifs-pricing-notes">
            <article className="tarifs-pricing-notes-card">
              <header className="tarifs-pricing-notes-head">
                <div className="tarifs-pricing-notes-icon" aria-hidden="true">
                  <span className="material-symbols-outlined">repeat</span>
                </div>
                <p className="tarifs-pricing-notes-title">Missions récurrentes</p>
              </header>
              <div className="tarifs-pricing-notes-body">
                <p className="tarifs-pricing-notes-highlight font-fraunces">3&nbsp;%</p>
                <p className="tarifs-pricing-notes-text">
                  Même MAR, missions suivantes — barème récurrent au contrat.
                </p>
              </div>
            </article>
            <article className="tarifs-pricing-notes-card">
              <header className="tarifs-pricing-notes-head">
                <div className="tarifs-pricing-notes-icon" aria-hidden="true">
                  <span className="material-symbols-outlined">contract</span>
                </div>
                <p className="tarifs-pricing-notes-title">Missions de longue durée</p>
              </header>
              <div className="tarifs-pricing-notes-body">
                <p className="tarifs-pricing-notes-highlight font-fraunces">Commission plafonnée</p>
                <p className="tarifs-pricing-notes-text">
                  Fixée au contrat — la part MedicusLoop ne dépasse pas ce plafond.
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
      <PionnierCtaStrip listePleinePionniers={listePleine} />
    </section>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  const comingSoon = ['Kinésithérapeutes', 'Infirmiers', 'Pharmaciens']

  return (
    <footer className="site-footer" aria-label="Pied de page MedicusLoop">
      <div className="site-footer__grid">
        {/* Col 1 */}
        <div>
          <MedicusLoopLogo labeled className="footer-brand-logo" />
          <p className="site-footer__tagline">
            Un bloc,
            <br />
            un rempla MAR,
            <br />
            une expérience.
          </p>
        </div>

        {/* Col 2 */}
        <div>
          <p className="site-footer__col-title">Bientôt disponible pour</p>
          <ul className="site-footer__soon-list">
            {comingSoon.map((item) => (
              <li key={item} className="site-footer__soon-li">
                <span className="site-footer__soon-label">{item}</span>
                <span className="site-footer__soon-pill">Bientôt</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <p className="site-footer__col-title">Contact</p>
          <div className="site-footer__contact-lines">
            <span className="site-footer__contact-line">
              <span className="material-symbols-outlined" aria-hidden="true">email</span>
              hello@medicus-loop.com
            </span>
            <span className="site-footer__contact-line">
              <span className="material-symbols-outlined" aria-hidden="true">phone</span>
              @medicusloop
            </span>
          </div>
        </div>
      </div>

      <FooterShare />

      <div className="site-footer__bar">
        <span className="site-footer__copy">{new Date().getFullYear()} MedicusLoop</span>
        <div className="site-footer__legal">
          <a href="#">Mentions legales</a>
          <a href="#conditions-generales-utilisation">Conditions générales d&apos;utilisation</a>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const placesPrises = await getWaitlistPionniersCount()
  const listePleinePionniers = placesPrises >= PIONNIER_PLACES_TOTAL

  return (
    <>
      <Navbar listePleinePionniers={listePleinePionniers} />
      <main id="intro">
      <PageAnimations />
      <Hero placesPrises={placesPrises} />
      <ProfilsMarSection listePleinePionniers={listePleinePionniers} />
      <SolutionSection listePleinePionniers={listePleinePionniers} />
      <VersusSection listePleinePionniers={listePleinePionniers} />
      <LoopExperienceSection listePleinePionniers={listePleinePionniers} />
      <TarifsSection placesPrises={placesPrises} />
      <PionniersSection placesPrises={placesPrises} />
      <FormulaireSection compactSectionTop listePleinePionniers={listePleinePionniers} />
      <Footer />
      </main>
    </>
  )
}
