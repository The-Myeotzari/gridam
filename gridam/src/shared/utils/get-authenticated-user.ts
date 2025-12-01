import { fail } from '@/app/apis/_lib/http'
import { MESSAGES } from '@/shared/constants/messages'
import getSupabaseServer from '@/shared/utils/supabase/server'

export async function getAuthenticatedUser() {
  const supabase = await getSupabaseServer()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) throw fail(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER, 401)
  return { supabase, user }
}
