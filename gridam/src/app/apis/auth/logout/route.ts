import { fail, ok } from '@/app/apis/_lib/http'
import { MESSAGES } from '@/shared/constants/messages'
import getSupabaseServer from '@/shared/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function POST(_req: NextRequest) {
  const supabase = await getSupabaseServer()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return fail(MESSAGES.AUTH.ERROR.LOGOUT, error.status)
  }
  return ok({ message: MESSAGES.AUTH.SUCCESS.LOGOUT }, 200)
}
