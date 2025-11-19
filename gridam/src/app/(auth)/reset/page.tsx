import { AuthHeader } from '@/features/auth/forgot/components/forgot-header'
import { Card } from '@/shared/ui/card'
import Link from 'next/link'
import ResetForm from './reset-form'

type PageProps = {
  searchParams: Promise<{
    code?: string | ''
  }>
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const { code } = await searchParams
  const token = code ? code : ''

  return (
    <div className="flex-1 flex item-center justify-center">
      <Card className="w-full max-w-md p-8 paper-texture crayon-border animate-fade-in mx-auto my-auto">
        <AuthHeader title="비밀번호 재설정" subtitle="새 비밀번호를 입력해주세요" />

        <ResetForm token={token} />

        <div className="mt-6 text-center">
          <div className="font-handwritten text-base text-muted-foreground">
            비밀번호를 기억하셨나요?{' '}
            <Link href="/login" className="text-primary hover:underline">
              로그인
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
