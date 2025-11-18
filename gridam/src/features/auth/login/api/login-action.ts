import { LoginSchema } from '@/types/zod/apis/auth'
import { MESSAGES } from '@/constants/messages'

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
    const firstError = parsed.error.issues[0]?.message ?? MESSAGES.AUTH.ERROR.LOGIN

    return { ok: false, message: firstError }
  }

  const { email, password } = parsed.data
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  const res = await fetch(`${baseUrl}/apis/auth/login`, {
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
