/**
 * Régions françaises (métropole + outre-mer), ordre alphabétique locale `fr`.
 * Source pour le select « Région » et la validation Zod côté serveur.
 */
export const REGIONS_FRANCE = [
  'Auvergne-Rhône-Alpes',
  'Bourgogne-Franche-Comté',
  'Bretagne',
  'Centre-Val de Loire',
  'Corse',
  'Grand Est',
  'Guadeloupe',
  'Guyane',
  'Hauts-de-France',
  'Île-de-France',
  'La Réunion',
  'Martinique',
  'Mayotte',
  'Normandie',
  'Nouvelle-Aquitaine',
  'Occitanie',
  'Pays de la Loire',
  "Provence-Alpes-Côte d'Azur",
] as const

export type RegionFrance = (typeof REGIONS_FRANCE)[number]

export const REGIONS_FRANCE_TRIEES = [...REGIONS_FRANCE].sort((a, b) => a.localeCompare(b, 'fr'))
