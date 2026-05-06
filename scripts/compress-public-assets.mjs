/**
 * Recompresse les images dans public/ (JPEG + PNG logo + OG).
 * Usage : npm run compress:public
 */
import { readdir } from 'node:fs/promises'
import { rename, stat, unlink, writeFile } from 'node:fs/promises'
import { join, extname } from 'node:path'
import process from 'node:process'
import sharp from 'sharp'

const ROOT = join(process.cwd(), 'public')

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const ent of entries) {
    const p = join(dir, ent.name)
    if (ent.isDirectory()) yield* walk(p)
    else yield p
  }
}

async function compressJpeg(absPath) {
  const before = (await stat(absPath)).size
  const img = sharp(absPath).rotate()
  const buf = await img.jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: '4:2:0' }).toBuffer()
  if (buf.length >= before * 0.98) {
    console.log(`  JPEG skip (pas de gain) ${absPath.replace(ROOT + '/', '')}`)
    return
  }
  const tmp = `${absPath}.tmp`
  await writeFile(tmp, buf)
  await rename(tmp, absPath)
  console.log(
    `  JPEG ${absPath.replace(ROOT + '/', '')} ${(before / 1024).toFixed(0)} Ko → ${(buf.length / 1024).toFixed(0)} Ko`,
  )
}

async function compressLogoPng(absPath) {
  const before = (await stat(absPath)).size
  const buf = await sharp(absPath).png({ compressionLevel: 9, effort: 10 }).toBuffer()
  if (buf.length >= before) return
  const tmp = `${absPath}.tmp`
  await writeFile(tmp, buf)
  await rename(tmp, absPath)
  console.log(
    `  PNG logo ${absPath.replace(ROOT + '/', '')} ${(before / 1024).toFixed(0)} Ko → ${(buf.length / 1024).toFixed(0)} Ko`,
  )
}

/** OG : cible 1200×630, JPEG pour poids faible (LinkedIn / RS acceptent très bien le JPEG). */
async function compressOg(absPathPng, outJpeg) {
  const before = (await stat(absPathPng)).size
  const buf = await sharp(absPathPng)
    .resize(1200, 630, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer()
  await writeFile(outJpeg, buf)
  await unlink(absPathPng)
  console.log(
    `  OG ${absPathPng.replace(ROOT + '/', '')} ${(before / 1024).toFixed(0)} Ko → ${outJpeg.replace(ROOT + '/', '')} ${(buf.length / 1024).toFixed(0)} Ko`,
  )
}

async function main() {
  console.log('Compression des assets dans public/ …')
  for await (const abs of walk(ROOT)) {
    const ext = extname(abs).toLowerCase()
    const rel = abs.replace(ROOT + '/', '')
    if (rel === 'og-image.png') {
      await compressOg(abs, join(ROOT, 'og-image.jpg'))
      continue
    }
    if (ext === '.jpg' || ext === '.jpeg') {
      await compressJpeg(abs)
      continue
    }
    if (rel === 'logo/MedicusLoop_MAR_transparent_FINAL.png') {
      await compressLogoPng(abs)
    }
  }
  console.log('Terminé.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
