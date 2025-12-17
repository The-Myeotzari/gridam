import { API_ENDPOINTS } from '@/shared/constants/api.endpoints'
import { MESSAGES } from '@/shared/constants/messages'
import { api } from '@/shared/lib/fetch-api'

export async function forgetAction(prevState: { error: string | null }, formData: FormData) {
  const email = formData.get('email') as string

  try {
    const res = await api(`${API_ENDPOINTS.AUTH.RESET_REQUEST}`, {
      method: 'POST',
      withCredentials: false,
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
