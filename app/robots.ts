import type { MetadataRoute } from 'next'
import {
  PATH_CONDITIONS_GENERALES_UTILISATION,
  PATH_MENTIONS_LEGALES,
} from '@/lib/legal-routes'

/** Même origine que metadataBase dans app/layout.tsx */
const SITE = 'https://medicus-loop.com'

export default function robots(): MetadataRoute.Robots {
  const disallowLegalOnly = [
    PATH_CONDITIONS_GENERALES_UTILISATION,
    PATH_MENTIONS_LEGALES,
  ]

  return {
    rules: [
      // Prévisualisations / Open Graph (Sharing Debugger) — évite les faux positifs « bloqué par robots.txt ».
      { userAgent: 'facebookexternalhit', allow: '/', disallow: disallowLegalOnly },
      { userAgent: 'Facebot', allow: '/', disallow: disallowLegalOnly },
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowLegalOnly,
      },
    ],
    host: SITE,
  }
}
