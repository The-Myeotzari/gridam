'use server'
import { MESSAGES } from '@/shared/constants/messages'
import { cookies } from 'next/headers'

export async function resetAction(formData: FormData) {
  const token = formData.get('token')
  const password = formData.get('password')
  const confirmPassword = formData.get('confirmPassword')

  const cookieStore = cookies()
  const cookieHeader = (await cookieStore)
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

  const apiPath = '/apis/auth/reset/complete'
  const apiBaseUrl = 'http://localhost:3000'

  try {
    const response = await fetch(`${apiBaseUrl}${apiPath}`, {
      method: 'POST',
      cache: 'no-store',
      credentials: 'include',
      next: { revalidate: 0 },
      headers: {
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        newPassword: password,
        confirmPassword,
        token,
      }),
    })

    if (!response.ok) {
      let errorData: { message?: string } | null = null
      try {
        errorData = await response.json()
      } catch (e) {
        return { error: `서버 오류 발생. 상태 코드: ${response.status}` }
      }

      return { error: errorData?.message || MESSAGES.AUTH.ERROR.PASSWORD_RESET }
    }

    const successData = await response.json()
    return { success: successData?.message || MESSAGES.AUTH.SUCCESS.PASSWORD_RESET }
  } catch (error) {
    return { error: MESSAGES.AUTH.ERROR.PASSWORD_RESET }
  }
}
