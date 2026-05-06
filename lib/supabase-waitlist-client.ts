import { createClient } from '@supabase/supabase-js'

/** Client Supabase pour la waitlist (insert / mises à jour serveur). Service role si dispo, sinon anon. */
export function createWaitlistSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    const missing = [
      !url ? 'NEXT_PUBLIC_SUPABASE_URL' : null,
      !key ? 'SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_ANON_KEY' : null,
    ].filter(Boolean)
    throw new Error(`Variables Supabase manquantes : ${missing.join(', ')}`)
  }
  return createClient(url, key)
}
