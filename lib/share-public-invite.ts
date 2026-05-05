/** Lien public MedicusLoop : invitation entre confrères (hors parrainage inscrit). */
export const SHARE_PUBLIC_PAGE_URL = 'https://medicus-loop.com'

/** Ajoute `?source=` (ou `&source=`) si un hash MD5 hex (32 car.) est fourni ; sinon lien public seul. */
export function buildSharePageUrl(sourceHash?: string | null): string {
  const base = SHARE_PUBLIC_PAGE_URL.replace(/\/$/, '')
  const s = sourceHash?.trim()
  if (!s) return base
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}source=${encodeURIComponent(s)}`
}

export const SHARE_PUBLIC_MESSAGE =
  'Je te glisse une info entre confrères : MedicusLoop prépare la plateforme MAR (matching IA, contrats intégrés). À jeter un œil si les rempla te parlent :'

export const SHARE_PUBLIC_EMAIL_SUBJECT = 'À voir entre confrères — MedicusLoop / MAR'
