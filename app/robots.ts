import type { MetadataRoute } from 'next'
import {
  PATH_CONDITIONS_GENERALES_UTILISATION,
  PATH_MENTIONS_LEGALES,
} from '@/lib/legal-routes'

/** Même origine que metadataBase dans app/layout.tsx */
const SITE = 'https://medicus-loop.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [PATH_CONDITIONS_GENERALES_UTILISATION, PATH_MENTIONS_LEGALES],
      },
    ],
    host: SITE,
  }
}
