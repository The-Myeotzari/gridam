import { Card } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import LoginForm from './login-form'

export default function Page() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="w-full max-w-md p-8 paper-texture crayon-border animate-fade-in mx-auto my-auto shadow-card">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <Image
            src="/favicon.ico"
            alt="그리담 로고"
            width={56}
            height={56}
            className="mx-auto mb-3"
            style={{ width: 'auto', height: 'auto' }}
          />
          <h1 className="text-3xl font-extrabold">그리담 GRIDAM</h1>
          <p className="text-muted-foreground">오늘의 이야기를 그려요</p>
        </div>

        {/* 바디: 폼만 */}
        <LoginForm />

        {/* 푸터 */}
        <div className="mt-6 text-center font-handwritten text-base text-muted-foreground">
          <Link href="/forgot" className="hover:underline">
            비밀번호를 잊으셨나요?
          </Link>
          <div className="mt-3">
            계정이 없으신가요?{' '}
            <Link href="/register" className="text-primary hover:underline font-semibold">
              회원가입
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
