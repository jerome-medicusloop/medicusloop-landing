import type { ShareInviteChannelId } from './share-public-invite'

/**
 * Messages après inscription Pionnier (lien `?source=`).
 * Ton : cercle limité, parrainage, avant la fermeture.
 */
export const PIONNIER_SHARE_MESSAGES = {
  whatsapp:
    'Je viens de prendre ma place Pionnier sur MedicusLoop (MAR nouvelle génération — cercle limité). Voici mon lien de parrainage pour que tu passes avant fermeture :',

  sms: 'Pionnier MedicusLoop — mon lien parrainage (places limitées) :',

  email:
    'Bonjour,\n\nJe viens de rejoindre MedicusLoop en Pionnier (places nominatives, nombre limité). Je vous transmets mon lien de parrainage pour que vous puissiez vous positionner :',

  linkedin:
    'J’ai rejoint MedicusLoop en Pionnier — plateforme MAR qui rapproche praticiens et établissements avec un parcours plus direct. Lien de parrainage (cercle limité) :',

  facebook:
    'Réseau confrères : MedicusLoop ouvre un cercle Pionnier limité sur la nouvelle génération MAR. Mon lien de parrainage pour anticiper :',

  twitter:
    'Place Pionnier MedicusLoop (MAR, cercle limité). Lien parrainage si tu veux passer avant fermeture :',

  copy:
    'Je partage mon lien Pionnier MedicusLoop (plateforme MAR, places nominatives limitées) :',
} as const satisfies Record<ShareInviteChannelId, string>

export const PIONNIER_SHARE_MESSAGE = PIONNIER_SHARE_MESSAGES.copy

export const PIONNIER_EMAIL_SUBJECT = 'Mon lien Pionnier — MedicusLoop (MAR)'
