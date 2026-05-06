import { createWaitlistSupabaseClient } from '@/lib/supabase-waitlist-client'

export type WaitlistUnsubscribePreview = {
  email: string
  alreadyUnsubscribed: boolean
}

/** Charge l’inscription liée au jeton (serveur uniquement). */
export async function getWaitlistUnsubscribePreview(
  unsubscribeToken: string,
): Promise<WaitlistUnsubscribePreview | null> {
  const supabase = createWaitlistSupabaseClient()
  const { data, error } = await supabase
    .from('waitlist_pionniers')
    .select('email, email_communication_status')
    .eq('unsubscribe_token', unsubscribeToken)
    .maybeSingle()

  if (error || !data?.email) return null
  return {
    email: data.email,
    alreadyUnsubscribed: data.email_communication_status === 'unsubscribed',
  }
}
