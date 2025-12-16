'use server'
import { API_ENDPOINTS } from '@/shared/constants/api.endpoints'
import { MESSAGES } from '@/shared/constants/messages'
import { api } from '@/shared/lib/fetch-api'
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

  try {
    const response = await api(`${API_ENDPOINTS.AUTH.RESET_COMPLETE}}`, {
      method: 'POST',
      cookieHeader,
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
