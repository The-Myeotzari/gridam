import LoginForm from '@/features/auth/login/components/login-form'
import { URL_CONSTANTS } from '@/shared/constants/url.constants'
import { Card } from '@/shared/ui/card'
import Image from 'next/image'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="w-full max-w-md p-8 paper-texture crayon-border animate-fade-in mx-auto my-auto shadow-card">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <Image
            src="/image/logo.png"
            width={56}
            height={56}
            alt="그리담로고"
            className=" mx-auto"
          />
          <h1 className="text-3xl font-extrabold">그리담 GRIDAM</h1>
          <p className="text-muted-foreground">오늘의 이야기를 그려요</p>
        </div>

        {/* 바디: 폼만 */}
        <LoginForm />

        {/* 푸터 */}
        <div className="mt-6 text-center font-handwritten text-base text-muted-foreground">
          <Link href={URL_CONSTANTS.AUTH.FORGOT} className="hover:underline">
            비밀번호를 잊으셨나요?
          </Link>
          <div className="mt-3">
            계정이 없으신가요?{' '}
            <Link
              href={URL_CONSTANTS.AUTH.REGISTER}
              className="text-primary hover:underline font-semibold"
            >
              회원가입
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
