import { MESSAGES } from '@/constants/messages'
import { api } from '@/lib/api'
import { AxiosError } from 'axios'
import { RegisterFormData } from '@/features/auth/register/types/register'
// api 불러오기
export async function registerUser(data: Omit<RegisterFormData, 'comfirmPassword'>) {
  try {
    const res = await api.post('/auth/register', data)
    return res.data
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 409) {
        throw new Error(error.response?.data?.message)
      }

      if (error.response?.status === 429) {
        throw new Error(MESSAGES.AUTH.ERROR.REGISTER_TOO_MANY_REQUEST)
      }

      throw new Error(error.response?.data?.message || MESSAGES.AUTH.ERROR.REGISTER)
    }
    // AxiosError가 아닌 경우
    throw new Error(MESSAGES.AUTH.ERROR.REGISTER)
  }
}
