import { createClient } from '@supabase/supabase-js'
import { PIONNIER_COUNT_DISPLAY_MIN, PIONNIER_PLACES_TOTAL } from '@/lib/pionnier-constants'

export { PIONNIER_COUNT_DISPLAY_MIN, PIONNIER_PLACES_TOTAL } from '@/lib/pionnier-constants'

/**
 * Simuler « liste Pionniers complète » : uniquement si `PIONNIER_MOCK_LISTE_PLEINE=true` est **défini**
 * dans `.env` / `.env.local`. Variable absente, vide ou autre valeur → **pas de bypass**, comptage réel Supabase.
 */
function mockListePleineFromEnv(): boolean {
  const raw = process.env.PIONNIER_MOCK_LISTE_PLEINE
  if (raw == null || raw === '') return false
  return raw.trim() === 'true'
}

/** Borne [0, 50] puis plancher d’affichage à {@link PIONNIER_COUNT_DISPLAY_MIN}. */
function toDisplayPionnierCount(raw: number): number {
  if (!Number.isFinite(raw)) raw = 0
  const capped = Math.max(0, Math.min(PIONNIER_PLACES_TOTAL, Math.floor(raw)))
  return Math.min(PIONNIER_PLACES_TOTAL, Math.max(capped, PIONNIER_COUNT_DISPLAY_MIN))
}

/**
 * Nombre d’inscrits **validés** (`validated = true`) dans `waitlist_pionniers` pour la jauge Pionniers.
 * 1) RPC `count_waitlist_pionniers` (clé anon suffit une fois la migration appliquée).
 * 2) Sinon comptage `head: true` avec `SUPABASE_SERVICE_ROLE_KEY` si défini (contourne la RLS).
 */
export async function getWaitlistPionniersCount(): Promise<number> {
  if (mockListePleineFromEnv()) {
    return toDisplayPionnierCount(PIONNIER_PLACES_TOTAL)
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || (!anonKey && !serviceKey)) return 0

  if (anonKey) {
    const supabase = createClient(url, anonKey)
    const { data, error } = await supabase.rpc('count_waitlist_pionniers')
    if (!error && data != null) {
      const n = typeof data === 'number' ? data : Number(data)
      if (!Number.isNaN(n)) return toDisplayPionnierCount(n)
    }
  }

  if (serviceKey) {
    const sb = createClient(url, serviceKey)
    const { count, error } = await sb
      .from('waitlist_pionniers')
      .select('*', { count: 'exact', head: true })
      .eq('validated', true)
    if (!error && count != null) return toDisplayPionnierCount(count)
  }

  return toDisplayPionnierCount(0)
}
