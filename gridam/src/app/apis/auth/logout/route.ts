import { fail, ok } from '@/app/apis/_lib/http'
import { MESSAGES } from '@/constants/messages'
import getSupabaseServer from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function POST(_req: NextRequest) {
  const supabase = await getSupabaseServer()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return fail(MESSAGES.AUTH.ERROR.LOGOUT, error.status)
  }
  return ok({ message: MESSAGES.AUTH.SUCCESS.LOGOUT }, 200)
}
