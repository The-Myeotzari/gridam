import { Card, CardFooter, CardHeader } from '@/shared/ui/card'
import Toast from '@/shared/ui/toast'
import Link from 'next/link'
import RegisterForm from './register-form'

export default function Page() {
  return (
    <Card
      indent="none"
      className="w-full max-w-md p-8 paper-texture crayon-border animate-fade-in mx-auto my-auto"
    >
      <CardHeader
        align="vertical"
        cardImage={
          <img src="/favicon.ico" width={56} height={56} alt="그리담로고" className=" mx-auto" />
        }
        cardTitle={<h1 className="text-4xl mb-2 text-navy-gray text-center">회원가입</h1>}
        cardDescription={<p className="text-lg text-muted-foreground">그리담과 함께 시작해요</p>}
      />
      <RegisterForm />
      <CardFooter className="flex-col">
        <div className="text-center flex gap-1">
          <div className="font-handwritten text-base text-muted-foreground">
            이미 계정이 있으신가요?
          </div>

          <Link href="/login" className="text-base text-primary hover:underline">
            로그인
          </Link>
          <Toast />
        </div>
      </CardFooter>
    </Card>
  )
}
