import { fail } from '@/app/apis/_lib/http'
import getSupabaseServer from '@/shared/utils/supabase/server'

export async function getAuthenticatedUser() {
  const supabase = await getSupabaseServer()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) throw fail('UNAUTHORIZED', 401)
  return { supabase, user }
}
