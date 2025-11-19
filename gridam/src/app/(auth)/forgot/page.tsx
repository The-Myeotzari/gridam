import { AuthHeader } from '@/features/auth/forgot/components/forgot-header'
import { Card } from '@/shared/ui/card'
import ForgotPassword from './forgot-password'
import { Suspense } from 'react'

type PageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: PageProps) {
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
        <Suspense>
          <ForgotPassword isSubmitted={isSubmitted} email={email} error={error} />
        </Suspense>
      </Card>
    </div>
  )
}
