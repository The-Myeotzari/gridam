import { fail, ok } from '@/app/apis/_lib/http'
import { MESSAGES } from '@/shared/constants/messages'
import { ResetCompleteSchema } from '@/shared/types/zod/apis/auth'
import getSupabaseServer from '@/shared/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { newPassword } = ResetCompleteSchema.parse(body)

    const supabase = await getSupabaseServer()

    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userData?.user) {
      return fail(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER, 401)
    }

    const { data, error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      return fail(MESSAGES.AUTH.ERROR.PASSWORD_RESET, error.status)
    }

    return ok({ user: data.user, message: MESSAGES.AUTH.SUCCESS.PASSWORD_RESET }, 200)
  } catch (err) {
    const message = err instanceof Error ? err.message : MESSAGES.AUTH.ERROR.PASSWORD_RESET
    return fail(message, 400)
  }
}
