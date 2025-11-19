import { fail, ok, withCORS } from '@/app/apis/_lib/http'
import { MESSAGES } from '@/shared/constants/messages'
import { SignUpSchema } from '@/shared/types/zod/apis/auth'
import getSupabaseAdmin from '@/shared/utils/supabase/admin'
import getSupabaseServer, { getOrigin } from '@/shared/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, nickname } = SignUpSchema.parse(body)

    const supabase = await getSupabaseServer()
    const origin = await getOrigin()
    const supabaseAdmin = await getSupabaseAdmin()

    const { data: userList, error: listErr } = await supabaseAdmin.auth.admin.listUsers()

    if (listErr) {
      return fail(MESSAGES.AUTH.ERROR.REGISTER, listErr.status)
    }

    const existingUser = userList.users.find((user) => user.email === email)

    if (existingUser) {
      if (existingUser.confirmed_at) {
        return fail('이미 존재하는 계정입니다.', 409)
      } else {
        await supabase.auth.resend({
          type: 'signup',
          email: email,
          options: {
            emailRedirectTo: `${origin}/login`,
          },
        })
        return fail('이미 가입된 계정입니다. 이메일 인증을 진행해주세요.', 409)
      }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/login`,
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
    return fail(message, 500)
  }
}
