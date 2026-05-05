/** Cap marketing « places Pionniers » (textes + jauge). */
export const PIONNIER_PLACES_TOTAL = 50

/** Plancher d’affichage : si le nombre réel (validés) est strictement inférieur à 23, la jauge affiche 23. */
export const PIONNIER_COUNT_DISPLAY_MIN = 23

/** Libellés CTA vers #inscription (navbar + bandeaux) selon places Pionniers restantes. */
export function inscriptionCtaFromListePleine(listePleine: boolean) {
  if (listePleine) {
    return {
      label: 'M’inscrire',
      ariaNav: 'M’inscrire pour être alerté du lancement MedicusLoop — aller au formulaire',
      ariaStrip: 'M’inscrire — aller au formulaire d’inscription',
      icon: 'how_to_reg',
    } as const
  }
  return {
    label: 'Devenir Pionnier',
    ariaNav: 'Devenir Pionnier MedicusLoop — aller au formulaire',
    ariaStrip: 'Devenir Pionnier — aller à l’inscription',
    icon: 'rocket_launch',
  } as const
}
