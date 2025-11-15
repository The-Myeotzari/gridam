import { ChangePasswordFormSchema } from "@/types/zod/apis/auth"
import getSupabaseServer from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import z, { ZodError } from "zod"
import { fail, ok } from "@/app/apis/_lib/http"
import { MESSAGES } from "@/constants/messages"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { password, newPassword } = ChangePasswordFormSchema.parse(body)

    const supabase = await getSupabaseServer()

    // 1) 현재 로그인 유저 가져오기
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return fail(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER, 401)
    }

    if (!user.email) {
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
      console.error('updateUser error:', updateError)
      return fail(MESSAGES.AUTH.ERROR.PASSWORD_RESET, 500)
    }

    return ok(MESSAGES.AUTH.SUCCESS.PASSWORD_RESET, 200)
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        {
          ok: false,
          message: '요청 값이 올바르지 않습니다.',
          errors: z.treeifyError(err),
        },
        { status: 400 }
      )
    }

    return fail('알 수 없는 오류가 발생했습니다.', 500)
  }
}