'use server'

import { redirect } from 'next/navigation'
import { LoginSchema } from '@/types/zod/apis/auth'
import { MESSAGES } from '@/constants/messages'

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
    // 실패 → /login 으로 다시 보내면서 쿼리에 에러 메시지 추가
    redirect(`/login?message=${encodeURIComponent(firstError)}`)
  }

  const { email, password } = parsed.data

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  const res = await fetch(`${baseUrl}/apis/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  })

  const json = await res.json()
  // HTTP 에러 or 응답 구조 문제 → 실패로 간주해서 /login으로 리다이렉트
  if (!res.ok || !json) {
    const message = typeof json?.message === 'string' ? json.message : MESSAGES.AUTH.ERROR.LOGIN

    redirect(`/login?message=${encodeURIComponent(message)}`)
  }

  // 성공 응답에서 메시지 꺼내기
  const successMessage: string = json?.data?.message ?? json?.message ?? MESSAGES.AUTH.SUCCESS.LOGIN

  // 성공 → 홈으로 리다이렉트 (+ 성공 메시지를 쿼리로 전달)
  redirect(`/?message=${encodeURIComponent(successMessage)}`)
}
