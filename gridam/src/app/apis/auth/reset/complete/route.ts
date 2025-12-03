import { fail, ok } from '@/app/apis/_lib/http'
import { MESSAGES } from '@/shared/constants/messages'
import { ResetCompleteSchema } from '@/shared/types/zod/apis/auth'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { newPassword } = ResetCompleteSchema.parse(body)

    const { supabase, user } = await getAuthenticatedUser()
    if (!user) return fail(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER, 401)
    const { data, error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      if (error.code === 'same_password') {
        return fail(MESSAGES.AUTH.ERROR.PASSWORD_SAME_AS_OLD, error.status)
      }
      return fail(MESSAGES.AUTH.ERROR.PASSWORD_RESET, error.status)
    }

    return ok({ user: data.user, message: MESSAGES.AUTH.SUCCESS.PASSWORD_RESET }, 200)
  } catch (err) {
    const message = err instanceof Error ? err.message : MESSAGES.AUTH.ERROR.PASSWORD_RESET
    return fail(message, 400)
  }
}
