import { fail, ok } from '@/app/apis/_lib/http'
import { MESSAGES } from '@/shared/constants/messages'
import { ChangePasswordFormSchema } from '@/shared/types/zod/apis/auth'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { NextRequest } from 'next/server'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { password, newPassword } = ChangePasswordFormSchema.parse(body)

    const { supabase, user } = await getAuthenticatedUser()

    if (!user) return fail(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER, 401)

    if (!user.email || user.app_metadata.provider !== 'email') {
      return fail('이메일 계정이 아닙니다.', 400)
    }

    if (password === newPassword) {
      return fail('현재 비밀번호와 다른 새 비밀번호를 입력해 주세요.', 400)
    }

    // 2) 기존 비밀번호 검증 (이메일 + 현재 비번으로 다시 로그인 시도)
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: password,
    })

    if (verifyError) {
      return fail(MESSAGES.AUTH.ERROR.WRONG_PASSWORD, 400)
    }

    // 3) 새 비밀번호로 업데이트
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      return fail(MESSAGES.AUTH.ERROR.PASSWORD_RESET, 500)
    }

    return ok({ message: MESSAGES.AUTH.SUCCESS.PASSWORD_RESET }, 200)
  } catch (err) {
    if (err instanceof ZodError) {
      const firstIssue = err.issues[0]
      return fail(firstIssue.message, 400)
    }

    return fail(MESSAGES.AUTH.ERROR.PASSWORD_RESET, 500)
  }
}
