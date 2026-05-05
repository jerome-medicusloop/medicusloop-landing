import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'MedicusLoop — Rempla MAR en clinique privée'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** Image Open Graph / Twitter (summary_large_image) : logo sur fond neutre lisible en aperçu RS. */
export default async function OpenGraphImage() {
  const logoPath = join(process.cwd(), 'public/logo/MedicusLoop_MAR_transparent_FINAL.png')
  const logo = await readFile(logoPath)
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(165deg, #f8fafc 0%, #e2e8f0 42%, #cbd5e1 100%)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- rendu Satori / ImageResponse */}
        <img src={logoSrc} alt="" height={220} style={{ height: 220, width: 'auto', objectFit: 'contain' }} />
        <p
          style={{
            marginTop: 36,
            fontSize: 28,
            fontWeight: 600,
            color: '#334155',
            letterSpacing: '-0.02em',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          }}
        >
          Rempla MAR · contrat & LoopExpérience
        </p>
      </div>
    ),
    { ...size },
  )
}
