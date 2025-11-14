import { fail, ok, withCORS } from '@/app/apis/_lib/http'
import { MESSAGES } from '@/constants/messages'
import { SignUpSchema } from '@/types/zod/apis/auth'
import getSupabaseServer, { getOrigin } from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, nickname } = SignUpSchema.parse(body)

    const supabase = await getSupabaseServer()
    const origin = await getOrigin()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/login`,
        data: nickname ? { nickname } : undefined, // user_metadata
      },
    })

    if (error) {
      return fail(MESSAGES.AUTH.ERROR.REGISTER, error.status)
    }

    return withCORS(
      ok(
        {
          user: data.user,
          message: MESSAGES.AUTH.SUCCESS.REGISTER_EMAIL,
        },
        201
      )
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : MESSAGES.AUTH.ERROR.REGISTER
    return fail(message, 400)
  }
}
