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

        {!isSubmitted ? (
          <Form action={forgetAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-handwritten text-lg">
                이메일
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={email}
                placeholder="your@email.com"
                className="font-handwritten text-lg rounded-xl h-12 w-full"
                required
              />
              {error ? <p className="text-sm text-destructive font-handwritten">{error}</p> : null}
            </div>

            <ForgotSubmitButton className="w-full font-handwritten text-xl rounded-full h-12 bg-linear-to-r from-primary to-secondary hover:opacity-90" />
          </Form>
        ) : (
          <div className="space-y-6">
            <div className="bg-primary/10 rounded-xl p-6 text-center">
              <p className="font-handwritten text-lg text-navy-gray mb-2">{email}</p>
              <p className="font-handwritten text-base text-muted-foreground">
                위 이메일로 비밀번호 재설정 링크를 전송했습니다. 이메일을 확인하고 링크를
                클릭해주세요.
              </p>
            </div>

            <div className="text-center space-y-3">
              <p className="font-handwritten text-sm text-muted-foreground">
                이메일을 받지 못하셨나요?
              </p>
              <Link href="/forgot">
                <Button
                  type="button"
                  variant="gradient"
                  label="다시 시도하기"
                  className="font-handwritten text-base rounded-full"
                />
              </Link>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <div className="font-handwritten text-base text-muted-foreground">
            계정이 없으신가요?{' '}
            <Link href="/signup" className="text-primary hover:underline">
              회원가입
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
