import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  if (!email && !password) redirect('/login?message=이메일과 비밀번호를 입력하세요.')
  if (!email) redirect('/login?message=이메일을 입력하세요.')
  if (!password) redirect('/login?message=비밀번호가 올바르지 않습니다.')

  redirect('/?message=로그인 성공')
}
