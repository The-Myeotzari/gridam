import { RegisterFormData } from '@/features/auth/register/types/register'
import { API_ENDPOINTS } from '@/shared/constants/api.endpoints'
import { MESSAGES } from '@/shared/constants/messages'
import { api } from '@/shared/lib/fetch-api'

// api 불러오기
export async function registerUser(data: Omit<RegisterFormData, 'confirmPassword'>) {
  try {
    const res = await api(`${API_ENDPOINTS.AUTH.REGISTER}`, {
      method: 'POST',
      withCredentials: false,
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      let errorBody = null
      try {
        errorBody = await res.json()
      } catch {
        // json실패
      }
      throw new Error(errorBody?.message ?? MESSAGES.AUTH.ERROR.REGISTER)
    }
    const result = await res.json()
    return result
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error(MESSAGES.AUTH.ERROR.REGISTER)
  }
}
