import { fail, ok } from '@/app/apis/_lib/http'
import { MESSAGES } from '@/shared/constants/messages'
import { ResetRequestSchema } from '@/shared/types/zod/apis/auth'
import getSupabaseServer, { getOrigin } from '@/shared/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = ResetRequestSchema.parse(body)

    const supabase = await getSupabaseServer()
    const origin = await getOrigin()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset`,
    })

    if (error) {
      return fail(MESSAGES.AUTH.ERROR.PASSWORD_RESET, error.status)
    }

    return ok({ message: MESSAGES.AUTH.SUCCESS.PASSWORD_RESET_EMAIL }, 200)
  } catch (err) {
    const message = err instanceof Error ? err.message : MESSAGES.AUTH.ERROR.PASSWORD_RESET
    return fail(message, 400)
  }
}
