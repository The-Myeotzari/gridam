import { AuthHeader } from '@/features/auth/forgot/components/forgot-header'
import { Card } from '@/shared/ui/card'
import ForgotPassword from './forgot-password'
import { redirect } from 'next/navigation'
import getSupabaseServer from '@/shared/utils/supabase/server'
import { URL_CONSTANTS } from '@/shared/constants/url.constants'

type PageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: PageProps) {
  const supabase = await getSupabaseServer()
  const { data } = await supabase.auth.getUser()

  // 로그인된 상태면 회원가입 페이지 접근 불가
  if (data.user) {
    redirect(URL_CONSTANTS.HOME)
  }

  const params = (await searchParams) ?? {}

  const isSubmitted = params?.sent === '1'
  const email = typeof params?.email === 'string' ? params!.email : ''
  const error = typeof params?.error === 'string' ? params!.error : ''

  return (
    <div className="flex-1 flex item-center justify-center">
      <Card className="w-full max-w-md p-8 paper-texture crayon-border animate-fade-in mx-auto my-auto">
        <AuthHeader
          title="비밀번호 찾기"
          subtitle={isSubmitted ? '이메일을 확인해주세요' : '가입하신 이메일을 입력해주세요'}
        />
        <ForgotPassword isSubmitted={isSubmitted} email={email} error={error} />
      </Card>
    </div>
  )
}
