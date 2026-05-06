'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

/** Chrome carte mission : aligné sur le mode clair (y compris si data-theme=dark sur le document). */

/** Espaces insécables fines entre milliers (affichage FR type « 4 250 € »). */
function formatEurosFr(amount: number): string {
  const n = Math.round(amount)
  const s = n.toString()
  const grouped = s.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f')
  return `${grouped}\u00a0€`
}

function missionDurationLabel(days: number): string {
  if (days <= 1) return '1 jour'
  return `${days} jours`
}

const MOIS_FR = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
] as const

/** Une date à minuit local (évite les dérives DST sur des offsets en jours). */
function addCalendarDays(base: Date, deltaDays: number): Date {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate())
  d.setDate(d.getDate() + deltaDays)
  return d
}

/**
 * Plage type « 12 – 16 juin 2026 » à partir d’aujourd’hui + offset,
 * `missionDays` = jours inclusifs (1 = un seul jour).
 */
function formatMissionDateRangeFr(startOffsetDays: number, missionDays: number, reference: Date = new Date()): string {
  const start = addCalendarDays(reference, startOffsetDays)
  const end = addCalendarDays(start, Math.max(0, missionDays - 1))

  const piece = (d: Date) => `${d.getDate()} ${MOIS_FR[d.getMonth()]} ${d.getFullYear()}`

  if (start.getTime() === end.getTime()) return piece(start)

  if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
    return `${start.getDate()} – ${end.getDate()} ${MOIS_FR[start.getMonth()]} ${start.getFullYear()}`
  }

  if (start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} ${MOIS_FR[start.getMonth()]} – ${end.getDate()} ${MOIS_FR[end.getMonth()]} ${start.getFullYear()}`
  }

  return `${piece(start)} – ${piece(end)}`
}

type Card = {
  city: string
  region: string
  clinic: string
  clinicRating: string
  specialty: string
  /** Jours à partir d’aujourd’hui jusqu’au premier jour de vacation (0 = aujourd’hui). */
  missionStartOffsetDays: number
  /** Nombre de jours de vacation (inclusif entre première et dernière date). */
  missionDays: number
  /** Forfait journalier en euros (brut indicatif démo). */
  rateEuros: number
  sector: '1' | '2'
  loopIcon: string
  loopName: string
  loopDetail: string
  /** Distance approximative établissement → bloc (km), affichée avec le nom de la clinique */
  loopDistance: string
  loopRating: string
  loopTags: string[]
  loopType: 'restaurant' | 'hotel' | 'activity' | 'museum'
  accentColor: string
  missionType: Array<'AG' | 'ALR' | 'Réa' | 'Garde' | 'Astreinte' | 'USC'>
  urgent?: boolean
}

/**
 * Badges mission : fonds **opaques** (pastel plein) + bordure couleur pleine.
 * `color` = accent pour pastille + palette forfait ; `text` = libellé lisible sur le fond pastel.
 */
const MISSION_COLORS: Record<string, { color: string; text: string; bg: string; border: string; label: string }> = {
  'AG':        { color: '#b91c1c', text: '#991b1b', bg: '#fecaca', border: '#b91c1c', label: 'AG' },
  'ALR':       { color: '#4f46e5', text: '#3730a3', bg: '#c7d2fe', border: '#4f46e5', label: 'ALR' },
  'Réa':       { color: '#0891b2', text: '#0e7490', bg: '#a5f3fc', border: '#0891b2', label: 'Réanimation' },
  'Garde':     { color: '#7c3aed', text: '#5b21b6', bg: '#ddd6fe', border: '#7c3aed', label: 'Garde' },
  'Astreinte': { color: '#db2777', text: '#9d174d', bg: '#fbcfe8', border: '#db2777', label: 'Astreinte' },
  'USC': { color: '#ea580c', text: '#9a3412', bg: '#ffedd5', border: '#ea580c', label: 'USC' },
}

/** Vert logo / primary (aligné sur --accent-blue) */
const PRIMARY_BRAND = '#10B981'

type CardPalette = {
  first: string
  second: string | null
  dual: boolean
  /** Texte montants & accents : 1 spé = couleur spé, 2 spé = vert marque */
  main: string
  /** Couleur de la barre du haut (spé ou vert primary) — pour animation shimmer */
  topBarHue: string
  forfaitBlockBg: string
  forfaitBorder: string
}

function getCardPalette(card: Card): CardPalette {
  const types = card.missionType
  const n = types.length
  const first = n > 0 ? MISSION_COLORS[types[0]].color : card.accentColor
  const second = n > 1 ? MISSION_COLORS[types[1]].color : null
  const dual = Boolean(second)

  const main = dual ? PRIMARY_BRAND : first

  /* Barre haute : même logique partout — couleur dominante puis fondu (dual = vert LOOP uniquement, pas arc-en-ciel) */
  const topBarHue = dual ? PRIMARY_BRAND : first

  const heroBg = 'var(--hero-card-bg)'

  /* Fond forfait : mélange uniquement avec le fond carte (opaque) — pas de transparent pour éviter l’effet « voilé ». */
  const forfaitBlockBg =
    dual && second
      ? `color-mix(in srgb, ${PRIMARY_BRAND} 32%, ${heroBg})`
      : `color-mix(in srgb, ${first} 32%, ${heroBg})`

  const forfaitBorder =
    dual && second
      ? `color-mix(in srgb, ${PRIMARY_BRAND} 52%, ${heroBg})`
      : `color-mix(in srgb, ${first} 50%, ${heroBg})`

  return {
    first,
    second,
    dual,
    main,
    topBarHue,
    forfaitBlockBg,
    forfaitBorder,
  }
}

const CARDS: Card[] = [
  {
    city: 'Montpellier',
    region: 'Hérault (34) · Occitanie',
    clinic: 'Clinique Saint-Roch',
    clinicRating: '4.7',
    specialty: 'Bloc polyvalent · Viscéral',
    missionStartOffsetDays: 12,
    missionDays: 5,
    rateEuros: 850,
    sector: '2',
    loopIcon: 'restaurant',
    loopName: 'La Réserve Rimbaud',
    loopDetail: 'Table étoilée · Vue sur le Lez',
    loopDistance: '≈ 1,8 km',
    loopRating: '4.9',
    loopTags: ['Table étoilée', 'Réservation incluse', '12 min du bloc'],
    loopType: 'restaurant',
    accentColor: '#b91c1c',
    missionType: ['AG'],
    urgent: true,
  },
  {
    city: 'Marseille',
    region: 'Bouches-du-Rhône (13) · PACA',
    clinic: 'Clinique Calanques Médical',
    clinicRating: '4.9',
    specialty: 'Orthopédie · Trauma',
    missionStartOffsetDays: 20,
    missionDays: 4,
    rateEuros: 920,
    sector: '1',
    loopIcon: 'hotel',
    loopName: 'InterContinental Vieux-Port',
    loopDetail: 'Vue sur la rade · Spa inclus',
    loopDistance: '≈ 1,3 km',
    loopRating: '4.8',
    loopTags: ['Vue mer', 'Spa inclus', 'Petit-déj offert'],
    loopType: 'hotel',
    accentColor: '#4f46e5',
    missionType: ['ALR'],
    urgent: true,
  },
  {
    city: 'Nice',
    region: 'Alpes-Maritimes (06) · PACA',
    clinic: 'Clinique Saint-Georges',
    clinicRating: '4.5',
    specialty: 'USC · Soins continus',
    missionStartOffsetDays: 28,
    missionDays: 6,
    rateEuros: 980,
    sector: '1',
    loopIcon: 'museum',
    loopName: 'Musée Marc Chagall',
    loopDetail: 'Art moderne · Cimiez',
    loopDistance: '≈ 2,1 km',
    loopRating: '4.7',
    loopTags: ['Billet coupe-file', 'Audio-guide', '12 min du bloc'],
    loopType: 'museum',
    accentColor: '#ea580c',
    missionType: ['USC'],
  },
  {
    city: 'Toulouse',
    region: 'Haute-Garonne (31) · Occitanie',
    clinic: 'Clinique Pasteur',
    clinicRating: '4.8',
    specialty: 'Chirurgie cardiaque · Astreinte',
    missionStartOffsetDays: 38,
    missionDays: 5,
    rateEuros: 1050,
    sector: '2',
    loopIcon: 'pedal_bike',
    loopName: 'Canal du Midi · Vélo',
    loopDetail: 'Itinéraire balisé · Réseau Vélo Toulouse',
    loopDistance: '≈ 3,5 km',
    loopRating: '5.0',
    loopTags: ['Location incluse', 'Casque fourni', '20 min du bloc'],
    loopType: 'activity',
    accentColor: '#7c3aed',
    missionType: ['Garde', 'Astreinte'],
    urgent: true,
  },
  {
    city: 'Lyon',
    region: 'Rhône (69) · Auvergne-Rhône-Alpes',
    clinic: 'Clinique de la Sauvegarde',
    clinicRating: '4.6',
    specialty: 'Bloc digestif · Urgences programmées',
    missionStartOffsetDays: 46,
    missionDays: 3,
    rateEuros: 950,
    sector: '2',
    loopIcon: 'restaurant',
    loopName: 'Paul Bocuse · Collonges',
    loopDetail: 'Gastronomie · Réservation MAR',
    loopDistance: '≈ 5,5 km',
    loopRating: '4.8',
    loopTags: ['Menu dégustation', 'Navette clinique', '25 min du bloc'],
    loopType: 'restaurant',
    accentColor: '#b91c1c',
    missionType: ['AG'],
    urgent: true,
  },
  {
    city: 'Nantes',
    region: 'Loire-Atlantique (44) · Pays de la Loire',
    clinic: 'Clinique Jules Verne',
    clinicRating: '4.4',
    specialty: 'Obstétrique · Césariennes',
    missionStartOffsetDays: 54,
    missionDays: 7,
    rateEuros: 880,
    sector: '1',
    loopIcon: 'hotel',
    loopName: 'Okko Nantes Château',
    loopDetail: 'Centre-ville · Petit-déj inclus',
    loopDistance: '≈ 2,3 km',
    loopRating: '4.5',
    loopTags: ['Parking', 'Tram direct', '15 min du bloc'],
    loopType: 'hotel',
    accentColor: '#4f46e5',
    missionType: ['ALR'],
  },
  {
    city: 'Bordeaux',
    region: 'Gironde (33) · Nouvelle-Aquitaine',
    clinic: 'Polyclinique Bordeaux Rive-Droite',
    clinicRating: '4.8',
    specialty: 'Neurochirurgie · USI',
    missionStartOffsetDays: 72,
    missionDays: 5,
    rateEuros: 1000,
    sector: '2',
    loopIcon: 'museum',
    loopName: 'CAPC Musée d’art contemporain',
    loopDetail: 'Quais de la Garonne',
    loopDistance: '≈ 1,6 km',
    loopRating: '4.6',
    loopTags: ['Billet incluse', '18 min du bloc'],
    loopType: 'museum',
    accentColor: '#0891b2',
    missionType: ['Réa'],
  },
  {
    city: 'Strasbourg',
    region: 'Bas-Rhin (67) · Grand Est',
    clinic: 'Clinique Sainte-Anne',
    clinicRating: '4.5',
    specialty: 'Maxillo-facial · Ambulatoire',
    missionStartOffsetDays: 88,
    missionDays: 4,
    rateEuros: 830,
    sector: '2',
    loopIcon: 'restaurant',
    loopName: 'Au Crocodile',
    loopDetail: 'Winstub · Grande Île',
    loopDistance: '≈ 0,9 km',
    loopRating: '4.7',
    loopTags: ['Soirée offerte', '10 min du bloc'],
    loopType: 'restaurant',
    accentColor: '#b91c1c',
    missionType: ['AG'],
  },
  {
    city: 'Rennes',
    region: 'Ille-et-Vilaine (35) · Bretagne',
    clinic: 'Clinique Saint-Yves',
    clinicRating: '4.3',
    specialty: 'Hépato-biliaire · Bloc mixte',
    missionStartOffsetDays: 102,
    missionDays: 5,
    rateEuros: 810,
    sector: '2',
    loopIcon: 'pedal_bike',
    loopName: 'Voie express Vélo Rennes',
    loopDetail: 'Maillage sécurisé · La Vilaine',
    loopDistance: '≈ 4,2 km',
    loopRating: '4.4',
    loopTags: ['Vélo prêté', '22 min du bloc'],
    loopType: 'activity',
    accentColor: '#7c3aed',
    missionType: ['Garde'],
  },
  {
    city: 'Lille',
    region: 'Nord (59) · Hauts-de-France',
    clinic: 'Polyclinique du Parc',
    clinicRating: '4.6',
    specialty: 'Chirurgie orthopédique · Ambulatoire',
    missionStartOffsetDays: 118,
    missionDays: 6,
    rateEuros: 980,
    sector: '1',
    loopIcon: 'hotel',
    loopName: 'Couvent des Minimes',
    loopDetail: 'Vieux-Lille · Spa',
    loopDistance: '≈ 1,1 km',
    loopRating: '4.8',
    loopTags: ['Charme', '12 min du bloc'],
    loopType: 'hotel',
    accentColor: '#4f46e5',
    missionType: ['ALR', 'Astreinte'],
  },
]

/**
 * Permutation fixe des missions (effet « shuffle ») : même ordre à chaque visite / refresh.
 * Fisher–Yates avec PRNG déterministe (pas de Math.random au montage).
 */
function deckOrderMissionIndices(length: number, seedString: string): number[] {
  const arr = Array.from({ length }, (_, i) => i)
  let h = 2166136261
  for (let i = 0; i < seedString.length; i++) {
    h ^= seedString.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  let state = h >>> 0
  const next01 = () => {
    state = (Math.imul(state, 1103515245) + 12345) >>> 0
    return state / 0x1_0000_0000
  }
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(next01() * (i + 1))
    const t = arr[i]!
    arr[i] = arr[j]!
    arr[j] = t
  }
  return arr
}

const HERO_MISSION_DECK_INITIAL_ORDER = deckOrderMissionIndices(CARDS.length, 'medicusloop-hero-missions-v1')

/**
 * Landing : pas de chargement par ville (`/background-cities/…`) — évite 404 / requêtes inutiles.
 * Les photos ville type « premium » pourront être réactivées côté produit quand les assets sont garantis.
 * Missions **urgentes** : fond photo unique bloc opératoire (`public/background-operating-room.jpg`).
 * Autres missions : fond uni `--hero-card-bg`.
 */
const DEFAULT_CITY_BG = '/background-operating-room.jpg'

/** Cadrage photo bloc op. (paysage → portrait carte) */
const HERO_CARD_OR_FALLBACK_BG_POSITION = 'center 30%'

/**
 * Voile au-dessus de la photo (missions urgentes) : mélange léger --hero-card-bg pour le texte,
 * sans « laver » la ville — si le fond manque de contraste, baisser encore ces pourcentages.
 */
const HERO_CARD_READABILITY_SCRIM =
  'linear-gradient(180deg, color-mix(in srgb, var(--hero-card-bg) 34%, transparent) 0%, color-mix(in srgb, var(--hero-card-bg) 18%, transparent) 30%, color-mix(in srgb, var(--hero-card-bg) 22%, transparent) 52%, color-mix(in srgb, var(--hero-card-bg) 38%, transparent) 100%)'

/**
 * Urgent : voile doré très léger (cohérence marque) ; la photo reste dominante visuellement.
 */
const HERO_CARD_URGENT_TINT =
  'linear-gradient(168deg, color-mix(in srgb, var(--accent-gold) 20%, transparent) 0%, color-mix(in srgb, var(--accent-gold) 9%, transparent) 38%, color-mix(in srgb, var(--accent-gold) 4%, transparent) 100%)'

/** Bandeau haut mission urgente : or uni (ville / dept / region + badge), au-dessus de la photo */
const HERO_URGENT_HEADER_BG = '#f2d16a'
/** Brun foncé : ville + département / région (même couleur lisible sur or ; hiérarchie = taille + graisse) */
const HERO_URGENT_HEADER_TEXT = '#5c4008'
const HERO_URGENT_HEADER_BORDER = 'rgba(146, 94, 14, 0.38)'

/** Padding vertical bandeau ville (compact pour laisser place au corps carte) */
const HERO_HEADER_PAD_Y = 16
/** Padding zone contenu carte (sous la barre colorée) */
const HERO_CONTENT_PAD = '14px 22px 16px'
/** Espacement vertical homogène entre blocs : pastilles → forfait → grilles → LoopExperience → rail */
const HERO_STACK_GAP = 10
/** Espacement à l’intérieur du « corps » (forfait + lignes de grille mission) */
const HERO_CORPS_GAP = '12px'

/** Bandeau haut mission non urgente : même principe que l’or (ville / dept · region), teinte spé pour éviter l’effet « carte cassée » */
function nonUrgentHeaderChrome(topBarHue: string) {
  return {
    background: `color-mix(in srgb, ${topBarHue} 16%, var(--hero-card-panel-bg))`,
    borderBottom: `1px solid color-mix(in srgb, ${topBarHue} 32%, transparent)`,
  } as const
}

const LOOP_LABEL: Record<string, string> = {
  restaurant: 'Table sélectionnée',
  hotel: 'Hôtel négocié',
  activity: 'Activité ou sortie',
  museum: 'Musée ou lieu culturel',
}

/** Panneaux Service / Dates / Durée / Rémunération (padding haut un peu plus large : libellés caps + icône ne rognent pas) */
const DETAIL_PAD = '11px 12px 10px 12px'
const DETAIL_GAP = '0.4rem'
const DETAIL_LABEL_FS = '0.6rem'
const DETAIL_ICON_FS = '0.75rem'
const DETAIL_VALUE_FS = '0.8125rem'
const DETAIL_VALUE_LH = 1.42
const REMUN_VALUE_FS = '0.875rem'

const detailLabelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem',
  fontSize: DETAIL_LABEL_FS,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--hero-card-panel-label)',
  lineHeight: 1.35,
  minHeight: '1.35em',
}

const detailIconStyle: CSSProperties = {
  fontSize: DETAIL_ICON_FS,
  color: 'var(--hero-card-panel-label)',
  lineHeight: 1,
  overflow: 'visible',
  fontVariationSettings: "'FILL' 0",
}

const detailValueStyle: CSSProperties = {
  margin: 0,
  fontSize: DETAIL_VALUE_FS,
  fontWeight: 600,
  color: 'var(--text)',
  lineHeight: DETAIL_VALUE_LH,
  wordBreak: 'break-word',
}

const detailCellShell: CSSProperties = {
  minWidth: 0,
  minHeight: 'min-content',
  background: 'var(--hero-card-panel-bg)',
  border: '1px solid var(--hero-card-inner-border)',
  borderRadius: '10px',
  padding: DETAIL_PAD,
  display: 'flex',
  flexDirection: 'column',
  gap: DETAIL_GAP,
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  overflow: 'visible',
}

export default function HeroCards() {
  const [order, setOrder] = useState(() => [...HERO_MISSION_DECK_INITIAL_ORDER])
  const [swiping, setSwiping] = useState(false)
  const [swipeDir, setSwipeDir] = useState<'right' | 'left'>('right')
  const [btnActivating, setBtnActivating] = useState(false)
  const dirRef = useRef<'right' | 'left'>('right')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const swipeBusyRef = useRef(false)
  const autoPausedRef = useRef(false)
  const startSwipeRef = useRef<(dir?: 'left' | 'right') => void>(() => {})

  const scrollToFormulaire = useCallback(() => {
    const { pathname, search } = window.location
    window.history.pushState(null, '', `${pathname}${search}#inscription`)
    document.getElementById('inscription')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const startSwipe = useCallback((manualDir?: 'left' | 'right') => {
    if (swipeBusyRef.current) return
    swipeBusyRef.current = true
    const dir = manualDir ?? dirRef.current
    setSwipeDir(dir)
    setBtnActivating(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setSwiping(true)
      timerRef.current = setTimeout(() => {
        setOrder((prev) => {
          const [first, ...rest] = prev
          return [...rest, first]
        })
        setSwiping(false)
        setBtnActivating(false)
        dirRef.current = dir === 'right' ? 'left' : 'right'
        swipeBusyRef.current = false
      }, 550)
    }, 380)
  }, [])

  startSwipeRef.current = startSwipe

  const pauseAuto = () => {
    autoPausedRef.current = true
  }

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (autoPausedRef.current) return
      startSwipeRef.current()
    }, 3200)
    return () => {
      clearInterval(interval)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <>
    <div
      className="hero-cards-wrapper"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minWidth: '300px',
        minHeight: '540px',
      }}
      aria-live="polite"
    >
      {order.map((cardIdx, stackPos) => {
        const card = CARDS[cardIdx]
        const isTop = stackPos === 0
        const retourDisabled =
          isTop &&
          order.length === HERO_MISSION_DECK_INITIAL_ORDER.length &&
          order.every((v, i) => v === HERO_MISSION_DECK_INITIAL_ORDER[i])
        const isSwipingOut = isTop && swiping

        const zIndex = 10 - stackPos

        /* Au repos : une seule carte (pas de pile / fantômes). Pendant le swipe : la 2e carte apparaît en dessous. */
        const peekUnder = swiping && stackPos === 1
        const visible = stackPos === 0 || peekUnder
        const chromeAsFront = isTop || peekUnder

        let transform = 'scale(1) translateY(0)'
        let animTransition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease'

        if (isSwipingOut) {
          const tx = swipeDir === 'right' ? '120%' : '-120%'
          const rot = swipeDir === 'right' ? '14deg' : '-14deg'
          transform = `translateX(${tx}) rotate(${rot}) translateY(-20px)`
          animTransition = 'transform 0.52s cubic-bezier(0.55,0,1,0.45), opacity 0.52s ease'
        }

        const palette = getCardPalette(card)
        /* Photo : uniquement si urgent — toujours le repli bloc op. (pas de fetch par ville sur la landing). */
        const coverUrl = DEFAULT_CITY_BG
        const backdropBgImage = card.urgent
          ? `${HERO_CARD_URGENT_TINT}, ${HERO_CARD_READABILITY_SCRIM}, url(${coverUrl})`
          : 'none'
        const backdropBgSize = card.urgent ? '100% 100%, 100% 100%, cover' : undefined
        const backdropBgPos = card.urgent ? `0 0, 0 0, ${HERO_CARD_OR_FALLBACK_BG_POSITION}` : undefined

        const totalRemunerationEuros = card.missionDays * card.rateEuros
        const formattedDailyRate = formatEurosFr(card.rateEuros)
        const formattedTotalRem = formatEurosFr(totalRemunerationEuros)
        const durationLabel = missionDurationLabel(card.missionDays)
        const missionDatesLabel = formatMissionDateRangeFr(card.missionStartOffsetDays, card.missionDays)

        return (
          <div
            key={cardIdx}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex,
              opacity: visible ? 1 : 0,
              visibility: visible ? 'visible' : 'hidden',
              pointerEvents: isTop ? 'auto' : 'none',
              transform,
              transition: animTransition,
              transformOrigin: 'center center',
              borderRadius: '20px',
              ['--hero-card-radius' as string]: '20px',
              isolation: 'isolate',
              border: chromeAsFront ? '1px solid var(--hero-card-rim)' : '1px solid var(--border)',
              overflow: isSwipingOut ? 'visible' : 'hidden',
              boxShadow: chromeAsFront ? 'var(--shadow-hero-top)' : 'none',
              cursor: isTop ? 'pointer' : 'default',
              display: 'flex',
              flexDirection: 'column',
            }}
            aria-hidden={!isTop}
            role={isTop ? 'button' : undefined}
            tabIndex={isTop ? 0 : -1}
            aria-label={isTop ? `Voir la mission ${card.city} — rejoindre MedicusLoop` : undefined}
            onClick={isTop ? () => scrollToFormulaire() : undefined}
            onKeyDown={isTop ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                scrollToFormulaire()
              }
            } : undefined}
          >
            {card.urgent ? (
              <div
                style={{
                  flexShrink: 0,
                  paddingTop: HERO_HEADER_PAD_Y,
                  paddingBottom: HERO_HEADER_PAD_Y,
                  /* Même inset horizontal que le corps (16px 24px 12px) pour aligner le chip URGENT avec les blocs */
                  paddingLeft: 16,
                  paddingRight: 24,
                  background: HERO_URGENT_HEADER_BG,
                  borderBottom: `1px solid ${HERO_URGENT_HEADER_BORDER}`,
                  borderRadius: '19px 19px 0 0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <div
                    style={{
                      minWidth: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '4px',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: '1.45rem',
                        fontWeight: 700,
                        color: HERO_URGENT_HEADER_TEXT,
                        fontFamily: 'var(--font-fraunces), serif',
                        fontStyle: 'italic',
                        lineHeight: 1.12,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {card.city}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        color: HERO_URGENT_HEADER_TEXT,
                        letterSpacing: '0.02em',
                        lineHeight: 1.38,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {card.region}
                    </p>
                  </div>
                  <span
                    className="hero-urgent-badge"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'linear-gradient(180deg, #fffbeb 0%, #fde68a 100%)',
                      border: '1px solid rgba(120, 53, 15, 0.5)',
                      borderRadius: '8px',
                      padding: '5px 12px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      color: '#92400e',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      flexShrink: 0,
                    }}
                    aria-label="Mission urgente"
                  >
                    <span className="hero-urgent-badge-dot" style={{ boxShadow: '0 0 10px rgba(245, 158, 11, 0.85)' }} aria-hidden="true" />
                    <span className="hero-urgent-badge-label">Urgent</span>
                  </span>
                </div>
              </div>
            ) : (
              <div
                style={{
                  flexShrink: 0,
                  paddingTop: HERO_HEADER_PAD_Y,
                  paddingBottom: HERO_HEADER_PAD_Y,
                  paddingLeft: 16,
                  paddingRight: 24,
                  borderRadius: '19px 19px 0 0',
                  ...nonUrgentHeaderChrome(palette.topBarHue),
                }}
              >
                <div
                  style={{
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '4px',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: '1.45rem',
                      fontWeight: 700,
                      color: 'var(--text)',
                      fontFamily: 'var(--font-fraunces), serif',
                      fontStyle: 'italic',
                      lineHeight: 1.12,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {card.city}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      color: 'var(--hero-card-region-text)',
                      letterSpacing: '0.02em',
                      lineHeight: 1.38,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {card.region}
                  </p>
                </div>
              </div>
            )}

            <div
              style={{
                position: 'relative',
                flex: '1 1 0',
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Bandeau blanc : trait animé + établissement ; le fond photo / teinté ne commence qu’en dessous */}
              <div className="hero-card-upper-chrome">
                <div className="hero-card-top-bar-wrap" style={{ position: 'relative', zIndex: 2, flexShrink: 0 }} aria-hidden="true">
                  <div
                    className="hero-card-top-bar"
                    style={{
                      height: '100%',
                      ['--hero-card-bar-accent' as string]: palette.topBarHue,
                    }}
                  />
                </div>
                <div className="hero-card-establishment-strip">
                  <div
                    className="hero-card-clinic-head"
                    role="group"
                    aria-label={`${card.clinic}, note ${card.clinicRating} sur 5, environ ${card.loopDistance.replace(/^≈\s*/, '')} du bloc opératoire`}
                  >
                    <p
                      style={{
                        fontSize: '0.92rem',
                        color: 'var(--text)',
                        fontWeight: 600,
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        flexWrap: 'wrap',
                        width: '100%',
                        minWidth: 0,
                        lineHeight: 1.25,
                      }}
                    >
                      <span
                        style={{
                          minWidth: 0,
                          flex: '1 1 8rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {card.clinic}
                      </span>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '2px',
                          }}
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: '12px', color: 'var(--star-rating)', fontVariationSettings: "'FILL' 1" }}
                            aria-hidden="true"
                          >
                            star
                          </span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--star-rating)' }}>
                            {card.clinicRating}
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          style={{
                            fontWeight: 300,
                            color: 'var(--hero-card-clinic-separator, var(--hero-card-inner-border))',
                            fontSize: '0.85rem',
                            lineHeight: 1,
                          }}
                        >
                          ·
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            color: 'var(--loopexperience-accent)',
                          }}
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{
                              fontSize: '15px',
                              fontVariationSettings: "'FILL' 1",
                            }}
                            aria-hidden="true"
                          >
                            location_on
                          </span>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              letterSpacing: '0.02em',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {card.loopDistance}
                          </span>
                        </span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  flex: '1 1 0',
                  minHeight: 0,
                  minWidth: 0,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Photo + voiles : uniquement sous la rangée établissement (urgent) ; non urgent = fond uni */}
                <div
                  className="hero-card-photo-backdrop"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '0 0 19px 19px',
                    zIndex: 0,
                    pointerEvents: 'none',
                    backgroundColor: 'var(--hero-card-bg)',
                    backgroundImage: backdropBgImage,
                    ...(card.urgent
                      ? {
                          backgroundSize: backdropBgSize,
                          backgroundPosition: backdropBgPos,
                          backgroundRepeat: 'no-repeat',
                        }
                      : {}),
                  }}
                  aria-hidden="true"
                />

                <div
                  style={{
                    padding: HERO_CONTENT_PAD,
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1 1 0',
                    minHeight: 0,
                    position: 'relative',
                    zIndex: 2,
                    gap: HERO_STACK_GAP,
                    overflow: 'visible',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      justifyContent: 'center',
                      width: '100%',
                      flexShrink: 0,
                    }}
                  >
                    {card.missionType.map((type) => (
                      <span
                        key={type}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          background: MISSION_COLORS[type].bg,
                          border: `1px solid ${MISSION_COLORS[type].border}`,
                          color: MISSION_COLORS[type].text,
                          borderRadius: '6px',
                          padding: '3px 10px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          letterSpacing: '0.03em',
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: MISSION_COLORS[type].color,
                            flexShrink: 0,
                          }}
                          aria-hidden="true"
                        />
                        {MISSION_COLORS[type].label}
                      </span>
                    ))}
                  </div>

              {/* Corps : forfait + grille — pas de overflow:hidden ni shrink : contenu jamais rogné si spécialité sur plusieurs lignes */}
              <div
                style={{
                  flex: '1 0 auto',
                  minHeight: 'auto',
                  overflow: 'visible',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: HERO_CORPS_GAP,
                }}
              >

              {/* ─ Forfait ─ */}
              <div
                style={{
                  background: palette.forfaitBlockBg,
                  border: `1px solid ${palette.forfaitBorder}`,
                  borderRadius: '10px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  minWidth: 0,
                }}
              >
                <div style={{ minWidth: 0, flex: '1 1 auto' }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.55rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: palette.main,
                    }}
                  >
                    Forfait journalier
                  </p>
                  <p
                    style={{
                      margin: '1px 0 0',
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: palette.main,
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                    }}
                  >
                    {formattedDailyRate}
                  </p>
                </div>
                <span
                  style={{
                    background: `color-mix(in srgb, ${palette.main} 26%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${palette.main} 44%, transparent)`,
                    color: palette.main,
                    borderRadius: '7px',
                    padding: '3px 10px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Sect. {card.sector}
                </span>
              </div>

              {/* ─ Grille mission 2×2 : pas de « carte blanche » autour — seulement les 4 panneaux ─ */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: HERO_CORPS_GAP,
                  minWidth: 0,
                  flex: '0 0 auto',
                  alignContent: 'stretch',
                  alignItems: 'stretch',
                }}
              >
                <div style={detailCellShell}>
                  <span style={detailLabelStyle}>
                    <span className="material-symbols-outlined" style={detailIconStyle} aria-hidden="true">
                      medical_services
                    </span>
                    Service
                  </span>
                  <p style={detailValueStyle}>{card.specialty}</p>
                </div>
                <div style={detailCellShell}>
                  <span style={detailLabelStyle}>
                    <span className="material-symbols-outlined" style={detailIconStyle} aria-hidden="true">
                      schedule
                    </span>
                    Dates
                  </span>
                  <p style={detailValueStyle} suppressHydrationWarning>
                    {missionDatesLabel}
                  </p>
                </div>
                <div style={detailCellShell}>
                  <span style={detailLabelStyle}>
                    <span className="material-symbols-outlined" style={detailIconStyle} aria-hidden="true">
                      schedule
                    </span>
                    Durée
                  </span>
                  <p style={detailValueStyle}>{durationLabel}</p>
                </div>
                <div style={detailCellShell}>
                  <span style={{ ...detailLabelStyle, color: palette.main }}>
                    <span
                      className="material-symbols-outlined"
                      style={{ ...detailIconStyle, color: palette.main, fontVariationSettings: "'FILL' 1" }}
                      aria-hidden="true"
                    >
                      verified
                    </span>
                    Rémunération
                  </span>
                  <p
                    style={{
                      ...detailValueStyle,
                      fontSize: REMUN_VALUE_FS,
                      fontWeight: 800,
                      letterSpacing: '-0.01em',
                      lineHeight: 1.25,
                      color: palette.main,
                    }}
                    title={`${card.missionDays} j × ${card.rateEuros}\u00a0€ / jour (indicatif)`}
                  >
                    {formattedTotalRem}
                  </p>
                </div>
              </div>
              </div>

              {/* ─ LoopExperience (hors « corps » overflow:hidden pour éviter rognure bas de carte) ─ */}
              <div
                style={{
                  flexShrink: 0,
                  border: '1px solid var(--loopexperience-row-border)',
                  borderRadius: '9px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '8px',
                  background: 'var(--loopexperience-row-bg)',
                  backdropFilter: 'blur(12px) saturate(1.1)',
                  WebkitBackdropFilter: 'blur(12px) saturate(1.1)',
                }}
                aria-label={`${LOOP_LABEL[card.loopType] ?? 'LoopExpérience'} — ${card.loopName}. ${card.loopDetail}`}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '7px',
                      background: 'var(--loopexperience-icon-bg)',
                      border: '1px solid var(--loopexperience-icon-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: '15px', color: 'var(--loopexperience-accent)', fontVariationSettings: "'FILL' 1" }}
                      aria-hidden="true"
                    >
                      {card.loopIcon}
                    </span>
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'var(--loopexperience-accent)',
                        lineHeight: 1.2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {card.loopName}
                    </p>
                    <p style={{ margin: '1px 0 0', fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>
                      {card.loopDetail}
                    </p>
                  </div>
                </div>
              </div>

              {/* ─ Actions : toujours en bas de carte ─ */}
              <div
                className="hero-card-actions-rail"
                role="group"
                aria-label="Actions sur la mission"
                style={{ flexShrink: 0, marginTop: 'auto' }}
              >
                {/* Retour : désactivé au début du cycle (ordre initial mélangé) ; clic traverse si non focus */}
                {isTop ? (
                  <button
                    type="button"
                    disabled={retourDisabled}
                    className="hero-card-action-round hero-card-action-round--mock"
                    aria-label={
                      retourDisabled
                        ? 'Retour indisponible sur la première mission'
                        : 'Retour à la mission précédente (bientôt disponible)'
                    }
                    tabIndex={-1}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">undo</span>
                  </button>
                ) : (
                  <div className="hero-card-action-round hero-card-action-round--mock" aria-hidden="true">
                    <span className="material-symbols-outlined" aria-hidden="true">undo</span>
                  </div>
                )}
                <button
                  type="button"
                  disabled={!isTop}
                  className={`hero-card-action-round hero-card-action-round--passer${isTop && btnActivating && swipeDir === 'left' ? ' hero-card-action-round--activated' : ''}`}
                  aria-label="Passer cette mission"
                  onClick={(e) => {
                    e.stopPropagation()
                    pauseAuto()
                    startSwipe('left')
                  }}
                >
                  <span className="material-symbols-outlined hero-card-passer-icon" aria-hidden="true">close</span>
                </button>
                <button
                  type="button"
                  disabled={!isTop}
                  className="hero-card-action-round hero-card-action-round--detail"
                  aria-label="Plus d’informations sur la mission"
                  onClick={(e) => {
                    e.stopPropagation()
                    pauseAuto()
                    scrollToFormulaire()
                  }}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">info</span>
                </button>
                <button
                  type="button"
                  disabled={!isTop}
                  className={`hero-card-action-round hero-card-action-round--matcher${isTop && btnActivating && swipeDir === 'right' ? ' hero-card-action-round--activated' : ''}`}
                  aria-label="Matcher cette mission"
                  onClick={(e) => {
                    e.stopPropagation()
                    pauseAuto()
                    startSwipe('right')
                  }}
                >
                  <span className="material-symbols-outlined hero-card-matcher-icon" aria-hidden="true">favorite</span>
                </button>
              </div>
            </div>
            </div>
          </div>
          </div>
        )
      })}
    </div>

    </>
  )
}
