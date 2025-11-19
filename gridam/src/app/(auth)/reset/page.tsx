import { AuthHeader } from '@/features/auth/forgot/components/forgot-header'
import { resetAction } from '@/features/auth/reset/api/reset-action'
import Button from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import Input from '@/shared/ui/input'
import Label from '@/shared/ui/label'
import Link from 'next/link'

type PageProps = {
  params: Promise<{ token: string }>
}

export default async function ResetPasswordPage({ params }: PageProps) {
  const { token } = await params

  return (
    <div className="flex-1 flex item-center justify-center">
      <Card className="w-full max-w-md p-8 paper-texture crayon-border animate-fade-in mx-auto my-auto">
        <AuthHeader title="비밀번호 재설정" subtitle="새 비밀번호를 입력해주세요" />

        <form action={resetAction} className="space-y-6" noValidate>
          <input type="hidden" name="token" value={token} />

          <div className="space-y-2">
            <Label htmlFor="password" className="font-handwritten text-lg font-bold">
              새 비밀번호
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              className="font-handwritten text-lg rounded-xl h-12 w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="font-handwritten text-lg font-bold">
              비밀번호 확인
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="font-handwritten text-lg rounded-xl h-12 w-full"
              required
            />
          </div>

          <Button
            type="submit"
            variant="basic"
            label="비밀번호 변경"
            className="w-full font-handwritten text-xl rounded-full h-12 bg-linear-to-r from-primary to-secondary hover:opacity-90"
          />
        </form>

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
