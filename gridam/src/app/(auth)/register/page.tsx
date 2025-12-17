import { URL_CONSTANTS } from '@/shared/constants/url.constants'
import { Card, CardFooter, CardHeader } from '@/shared/ui/card'
import Toast from '@/shared/ui/toast'
import Image from 'next/image'
import Link from 'next/link'
import RegisterForm from './register-form'
import { redirect } from 'next/navigation'
import getSupabaseServer from '@/shared/utils/supabase/server'

export default async function Page() {
  const supabase = await getSupabaseServer()
  const { data } = await supabase.auth.getUser()

  // 로그인된 상태면 회원가입 페이지 접근 불가
  if (data.user) {
    redirect(URL_CONSTANTS.HOME)
  }
  return (
    <Card
      indent="none"
      className="w-full max-w-md p-8 paper-texture crayon-border animate-fade-in mx-auto my-auto"
    >
      <CardHeader
        align="vertical"
        cardImage={
          <Image
            src="/image/logo.png"
            width={56}
            height={56}
            alt="그리담로고"
            className=" mx-auto"
          />
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

          <Link href={URL_CONSTANTS.AUTH.LOGIN} className="text-base text-primary hover:underline">
            로그인
          </Link>
          <Toast />
        </div>
      </CardFooter>
    </Card>
  )
}
