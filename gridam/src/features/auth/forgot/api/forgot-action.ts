'use server'

import { redirect } from 'next/navigation'

export async function forgetAction(prevState: { error: string }, formData: FormData) {
  const email = formData.get('email')

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL || // 배포 환경에서 사용할 도메인 (예: https://myapp.com)
    'http://localhost:3000' // 개발 환경 기본값

  try {
    const res = await fetch(`${origin}/apis/auth/reset/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // 서버에서는 localStorage / token 필요 없음
      body: JSON.stringify({ email }),
      cache: 'no-store', // 서버 액션에서 캐시 방지 (중요)
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      const msg = errorData?.message || errorData?.error || '이메일 인증 요청에 실패했습니다.'

      return { error: msg }
    }

    redirect(`/forgot?sent=1&email=${encodeURIComponent(email as string)}`)
  } catch (err: any) {
    return { error: err.message || '알 수 없는 오류가 발생했습니다.' }
  }
}
