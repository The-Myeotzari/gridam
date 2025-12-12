import { API_ENDPOINTS } from '@/shared/constants/api.endpoints'
import { MESSAGES } from '@/shared/constants/messages'
import { LoginSchema } from '@/shared/types/zod/apis/auth'

export type LoginResult = {
  ok: boolean
  message: string
}

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const raw = {
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  }

  const parsed = LoginSchema.safeParse(raw)

  if (!parsed.success) {
    const email = raw.email.trim()
    const password = raw.password.trim()

    if (!email && !password) {
      return { ok: false, message: MESSAGES.AUTH.ERROR.EMPTY_EMAIL_PASSWORD }
    }

    if (!email) {
      return { ok: false, message: MESSAGES.AUTH.ERROR.EMPTY_EMAIL }
    }

    if (!password) {
      return { ok: false, message: MESSAGES.AUTH.ERROR.EMPTY_PASSWORD }
    }

    const emailIssue = parsed.error.issues.find((issue) => issue.path[0] === 'email')
    const passwordIssue = parsed.error.issues.find((issue) => issue.path[0] === 'password')

    if (emailIssue) {
      return { ok: false, message: MESSAGES.AUTH.ERROR.INVALID_EMAIL_FORMAT }
    }

    if (passwordIssue) {
      if (passwordIssue.code === 'too_small') {
        return { ok: false, message: MESSAGES.AUTH.ERROR.INVALID_PASSWORD_LENGTH }
      }

      return { ok: false, message: MESSAGES.AUTH.ERROR.INVALID_PASSWORD_FORMAT }
    }

    return { ok: false, message: MESSAGES.AUTH.ERROR.LOGIN }
  }

  const { email, password } = parsed.data

  const res = await fetch(`${API_ENDPOINTS.AUTH.LOGIN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  })

  const json = await res.json()

  if (!res.ok || !json?.ok) {
    const message = typeof json?.message === 'string' ? json.message : MESSAGES.AUTH.ERROR.LOGIN

    return { ok: false, message }
  }

  const successMessage = json?.data?.message ?? json?.message ?? MESSAGES.AUTH.SUCCESS.LOGIN

  return { ok: true, message: successMessage }
}
