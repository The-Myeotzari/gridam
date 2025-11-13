'use server'

import { redirect } from 'next/navigation'
import { LoginSchema } from '@/types/zod/apis/auth'
import { MESSAGES } from '@/constants/messages'
import getSupabaseServer from '@/utils/supabase/server'

export async function loginAction(formData: FormData): Promise<void> {
  // FormData -> 객체
  const raw = {
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  }

  // Zod 유효성 검사
  const parsed = LoginSchema.safeParse(raw)

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? MESSAGES.AUTH.ERROR.LOGIN

    // 실패 → 다시 /login 으로 + 쿼리에 메시지
    redirect(`/login?message=${encodeURIComponent(firstError)}`)
  }

  const { email, password } = parsed.data

  // Supabase 로그인 시도
  const supabase = await getSupabaseServer()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    // 이메일 없거나 비밀번호 틀림
    redirect(`/login?message=${encodeURIComponent(MESSAGES.AUTH.ERROR.ACCOUNT_NOT_EXIST)}`)
  }

  // 성공 → 홈으로 redirect (성공 메시지까지 보내고 싶으면 쿼리로)
  redirect(`/?message=${encodeURIComponent(MESSAGES.AUTH.SUCCESS.LOGIN)}`)
}
