import { fail, ok } from '@/app/apis/_lib/http'
import { MESSAGES } from '@/constants/messages'
import { LoginSchema } from '@/types/zod/apis/auth'
import getSupabaseServer from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = LoginSchema.parse(body)

    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return fail(MESSAGES.AUTH.ERROR.ACCOUNT_NOT_EXIST, 401)
    }

    return ok({ user: data.user, session: data.session, message: MESSAGES.AUTH.SUCCESS.LOGIN }, 200)
  } catch (err) {
    const message = err instanceof Error ? err.message : MESSAGES.AUTH.ERROR.LOGIN
    return fail(message, 400)
  }
}
