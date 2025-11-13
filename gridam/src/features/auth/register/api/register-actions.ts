import { RegisterFormData } from '@/app/(auth)/register/register-form'
import { MESSAGES } from '@/constants/messages'
import { api } from '@/lib/api'
import { AxiosError } from 'axios'
// api 불러오기
export async function registerUser(
  data: Pick<RegisterFormData, 'nickname' | 'email' | 'password'>
) {
  try {
    const res = await api.post('/auth/register', data)
    return res.data
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 409) {
        throw new Error('이미 가입된 계정입니다. 이메일 인증을 진행해주세요.')
      }

      throw new Error(error.response?.data?.message || MESSAGES.AUTH.ERROR.REGISTER)
    }
    // AxiosError가 아닌 경우
    throw new Error(MESSAGES.AUTH.ERROR.REGISTER)
  }
}
