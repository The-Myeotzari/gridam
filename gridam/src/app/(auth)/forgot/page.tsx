import { forgetAction } from '@/features/auth/forgot/api/forgot-action'
import { AuthHeader } from '@/features/auth/forgot/components/forgot-header'
import ForgotSubmitButton from '@/features/auth/forgot/components/forgot-submit-button'
import Button from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import Input from '@/shared/ui/input'
import Label from '@/shared/ui/label'
import Form from 'next/form'
import Link from 'next/link'

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
