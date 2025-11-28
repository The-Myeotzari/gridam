import { MESSAGES } from '@/shared/constants/messages'
import { error } from 'console'

export async function forgetAction(prevState: { error: string | null }, formData: FormData) {
  const email = formData.get('email') as string

  try {
    const res = await fetch(`/apis/auth/reset/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
    if (!res.ok) {
      const data = await res.json()
      return { error: data?.message || MESSAGES.AUTH.ERROR.EMAIL_VERIFICATION_REQUEST_FAILED }
    }
    return { error: null }
  } catch (error: unknown) {
    return { error: MESSAGES.AUTH.ERROR.EMAIL_VERIFICATION_REQUEST_FAILED }
  }
}
