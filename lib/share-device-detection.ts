/** Client Hints (Chromium) — optionnel sur `Navigator` selon la lib DOM TypeScript. */
type NavigatorWithUaCh = Navigator & {
  userAgentData?: { mobile?: boolean; platform?: string }
}

/**
 * Détection « type d’appareil » pour les canaux de partage — **sans** `innerWidth` ni breakpoints CSS.
 *
 * Signaux (du plus « device » au plus « capacité d’interaction ») :
 * 1. **User-Agent Client Hints** (`navigator.userAgentData.mobile`) — Chromium / Android / Edge (fiable pour *mobile* au sens Google).
 * 2. **Chaîne User-Agent** — repli ; iPad en mode bureau se déclare souvent comme Mac → voir (3).
 * 3. **Heuristique iPad** (`MacIntel` + écran tactile) — iPadOS ≥ 13.
 * 4. **Médias CSS** `(pointer: coarse)` et `(hover: none)` — ne disent pas « téléphone », mais « interaction tactile
 *    principale » (utile pour prioriser WhatsApp / natif vs bureau avec souris).
 *
 * Il n’existe pas de vérité absolue côté web : UA peut être figé (privacy), tablette + souris, etc. Combiner les
 * signaux reste la pratique courante ; pour un flux natif, envisager aussi `navigator.share` (Web Share API).
 */
export type ShareDeviceProfile = {
  /** UA classique type téléphone / tablette Android / iPhone / iPad (chaîne « iPad »). */
  legacyMobileUa: boolean
  /** Téléphone ou tablette — inclut iPad en UA « desktop ». */
  likelyMobileOrTablet: boolean
  /** Smartphone probable (pas tablette seule déduite du UA « Android sans Mobile »). */
  likelyPhone: boolean
  coarsePointer: boolean
  hoverNone: boolean
}

function readShareDeviceProfile(): ShareDeviceProfile {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return {
      legacyMobileUa: false,
      likelyMobileOrTablet: false,
      likelyPhone: false,
      coarsePointer: false,
      hoverNone: false,
    }
  }

  const ua = navigator.userAgent
  const legacyMobileUa = /Mobile|Android|iPhone|iPad/i.test(ua)

  const isIPadDesktopUa =
    /iPad/.test(ua) || (navigator.platform === 'MacIntel' && (navigator.maxTouchPoints ?? 0) > 1)

  const uaData = (navigator as NavigatorWithUaCh).userAgentData
  const chMobile = uaData && typeof uaData.mobile === 'boolean' ? uaData.mobile : null

  let likelyPhone = /iPhone/i.test(ua) || /Android.*Mobile/i.test(ua)
  if (/Android/i.test(ua) && !/Mobile/i.test(ua)) {
    likelyPhone = false
  }
  if (chMobile === true) {
    likelyPhone = true
  }
  if (isIPadDesktopUa) {
    likelyPhone = false
  }

  const likelyMobileOrTablet =
    legacyMobileUa || isIPadDesktopUa || chMobile === true

  const coarsePointer = window.matchMedia('(pointer: coarse)').matches
  const hoverNone = window.matchMedia('(hover: none)').matches

  return {
    legacyMobileUa,
    likelyMobileOrTablet,
    likelyPhone,
    coarsePointer,
    hoverNone,
  }
}

/** À appeler côté client (après montage), pas pendant le rendu serveur. */
export function getShareDeviceProfile(): ShareDeviceProfile {
  return readShareDeviceProfile()
}
