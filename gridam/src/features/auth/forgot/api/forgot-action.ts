import { MESSAGES } from '@/shared/constants/messages'
import axios, { AxiosError } from 'axios'

export async function forgetAction(prevState: { error: string | null }, formData: FormData) {
  const email = formData.get('email') as string

  try {
    const res = await axios.post(`/apis/auth/reset/request`, { email })
    return { error: null }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const message =
        error.response?.data?.message || MESSAGES.AUTH.ERROR.EMAIL_VERIFICATION_REQUEST_FAILED
      return { error: message }
    }
    return { error: MESSAGES.AUTH.ERROR.EMAIL_VERIFICATION_REQUEST_FAILED }
  }
}
