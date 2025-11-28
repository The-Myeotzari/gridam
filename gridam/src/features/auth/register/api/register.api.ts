import { RegisterFormData } from '@/features/auth/register/types/register'
import { MESSAGES } from '@/shared/constants/messages'

// api 불러오기
export async function registerUser(data: Omit<RegisterFormData, 'comfirmPassword'>) {
  try {
    const res = await fetch('/apis/auth/register', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      let errorBody = null
      try {
        errorBody = await res.json()
      } catch {}

      if (res.status === 409) {
        throw new Error(errorBody?.message ?? MESSAGES.AUTH.ERROR.ACCOUNT_NOT_EXIST)
      }
      if (res.status === 429) {
        throw new Error(MESSAGES.AUTH.ERROR.REGISTER_TOO_MANY_REQUEST)
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
