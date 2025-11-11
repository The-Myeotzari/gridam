export type LoginResult = { ok: boolean; message: string }

export async function loginAction(
  _prev: LoginResult | null,
  formData: FormData
): Promise<LoginResult> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  if (!email && !password) return { ok: false, message: '이메일과 비밀번호를 입력하세요.' }
  if (!email) return { ok: false, message: '이메일을 입력하세요.' }
  if (!password) return { ok: false, message: '비밀번호가 올바르지 않습니다.' }

  return { ok: true, message: '로그인 성공' }
}
