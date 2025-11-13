import { RegisterFormData } from '@/app/(auth)/register/page'
import { MESSAGES } from '@/constants/messages'
// api 불러오기
export async function registerUser(
  data: Pick<RegisterFormData, 'nickname' | 'email' | 'password'>
) {
  const res = await fetch('/apis/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const result = await res.json()

  if (res.ok) return result
  throw new Error(result.message || MESSAGES.AUTH.ERROR.REGISTER)
}
