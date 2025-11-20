'use server'

import { MESSAGES } from '@/shared/constants/messages'
import { cookies } from 'next/headers'
// console, error 등은 임포트하지 않습니다. (Next.js 환경에서 충돌 방지)

export async function resetAction(formData: FormData) {
  const token = formData.get('token')
  const password = formData.get('password') // 새 비밀번호 값
  const confirmPassword = formData.get('confirmPassword')
  console.log('resetAction >>>', { token, password, confirmPassword })

  // 1. 쿠키 설정 및 헤더 준비 (401 방어를 위해 필수)
  const cookieStore = cookies()
  const cookieHeader = (await cookieStore)
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

  const apiPath = '/apis/auth/reset/complete' // 백엔드 API 라우트 경로
  // 환경 변수를 도메인으로만 사용하여 URL 오류 방어
  const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  try {
    // 2. 백엔드 API 호출 (전체 URL 사용)
    const response = await fetch(`${apiBaseUrl}${apiPath}`, {
      method: 'POST',
      cache: 'no-store',
      credentials: 'include',
      next: { revalidate: 0 },
      headers: {
        Cookie: cookieHeader, // 🚨 클라이언트 세션을 백엔드에 전달
      },
      body: JSON.stringify({
        // 🚨 [핵심] 백엔드가 기대하는 필드명(newPassword) 사용
        newPassword: password,
        confirmPassword,
        // token은 API에서 사용하지 않을 가능성이 높지만, 형식 유지를 위해 포함
        token,
      }),
    })

    // 3. 응답 처리
    if (!response.ok) {
      // 에러 응답이 JSON이 아닐 경우(HTML)를 대비한 안전 코드 추가
      let errorData: any = {}
      try {
        errorData = await response.json()
      } catch (e) {
        // JSON 파싱 실패 시, 상태 코드로 에러 반환
        return { error: `서버 오류 발생. 상태 코드: ${response.status}` }
      }

      return { error: errorData?.message || MESSAGES.AUTH.ERROR.PASSWORD_RESET }
    }

    // 성공 응답
    const successData = await response.json()
    return { success: successData?.message || MESSAGES.AUTH.SUCCESS.PASSWORD_RESET }
  } catch (error) {
    // console.error('비번에러:', error)
    return { error: MESSAGES.AUTH.ERROR.PASSWORD_RESET }
  }
}
