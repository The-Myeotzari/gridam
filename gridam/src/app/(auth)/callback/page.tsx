import { redirect } from 'next/navigation'

export default function AuthCallbackPage() {
  // 여기까지 오면 supabase가 쿠키/세션 세팅은 이미 끝냄
  redirect('/')

  // redirect가 sync라 사실 이건 안 보이지만, 타입 에러 방지용
  return null
}
