/**
 * Génère des PNG pour les boutons de partage dans l’e-mail (Simple Icons, licence CC0).
 * Usage : node scripts/generate-email-share-icons.mjs
 */
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { siFacebook, siGmail, siWhatsapp, siX } from 'simple-icons'

/** LinkedIn retiré du paquet Simple Icons (marque) : chemin équivalent viewBox 24×24. */
const LINKEDIN_STYLE = {
  hex: '0A66C2',
  path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '../public/icons/email-share')
const SIZE = 40

function toSvg(icon) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#${icon.hex}" d="${icon.path}"/></svg>`
}

async function writeIcon(filename, icon) {
  await sharp(Buffer.from(toSvg(icon), 'utf8'))
    .resize(SIZE, SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(join(outDir, filename))
}

mkdirSync(outDir, { recursive: true })
await writeIcon('whatsapp.png', siWhatsapp)
await writeIcon('email.png', siGmail)
await writeIcon('linkedin.png', LINKEDIN_STYLE)
await writeIcon('facebook.png', siFacebook)
await writeIcon('x.png', siX)
console.log('OK →', outDir)
