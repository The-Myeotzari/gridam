import { MESSAGES } from '@/constants/messages'
import { api } from '@/lib/api'
import { AxiosError } from 'axios'
import { error } from 'console'
import { redirect } from 'next/navigation'

export async function forgetAction(prevState: { error: string }, formData: FormData) {
  const email = formData.get('email')

  try {
    const res = await api.post(`/auth/reset/request`, { email })
    redirect(`/forgot?sent=1`)
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || '이메일 인증 요청에 실패했습니다.'
      return { error: message }
    }
    return { error: '이메일 인증 요청에 실패했습니다.' }
  }
}
//  redirect(`/forgot?sent=1&email=${encodeURIComponent(email as string)}`)
