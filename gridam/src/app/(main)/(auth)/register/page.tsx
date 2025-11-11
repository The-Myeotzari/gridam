'use client'
import Button from '@/components/ui/button.client'
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Toast from '@/components/ui/toast'
import { MESSAGES } from '@/constants/messages'
import { toast } from '@/store/toast-store'
import Image from 'next/image'
import Link from 'next/link'
import { SubmitHandler, useForm } from 'react-hook-form'

interface RegisterFormData {
  nickname: string
  email: string
  password: string
  confirmPassword: string
}
export default function RegisterForm() {
  const { register, handleSubmit } = useForm<RegisterFormData>()

  const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
    const { nickname, email, password, confirmPassword } = data

    //모든 항목을 입력해주세요.
    if (!nickname || !email || !password || !confirmPassword) {
      toast.error(MESSAGES.AUTH.ERROR.EMPTY_FORM)
      return
    }
    //이메일 형식이 올바르지 않습니다.
    const emailRegex =
      /^[0-9a-zA-Z]([-+.']?[0-9a-zA-Z])*@[0-9a-zA-Z]([-a-zA-Z0-9]+\.)+[a-zA-Z]{2,}$/i
    if (!emailRegex.test(email)) {
      toast.error(MESSAGES.AUTH.ERROR.INVALID_EMAIL_FORMAT)
      return
    }
    //비밀번호는 8자 이상이어야 합니다.
    if (password.length < 8) {
      toast.error(MESSAGES.AUTH.ERROR.INVALID_PASSWORD_LENGTH)
      return
    }
    //비밀번호에는 숫자, 영문 대·소문자, 특수문자가 각각 최소 1개 이상 포함되어야 합니다.
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    if (!passwordRegex.test(password)) {
      toast.error(MESSAGES.AUTH.ERROR.INVALID_PASSWORD_FORMAT)
      return
    }
    //현재 비밀번호와 일치하지 않습니다.
    if (password !== confirmPassword) {
      toast.error(MESSAGES.AUTH.ERROR.WRONG_PASSWORD)
      return
    }
    //회원가입이 완료되었습니다.
    toast.success(MESSAGES.AUTH.SUCCESS.REGISTER)
  }

  return (
    <Card indent="none">
      <CardHeader
        align="vertical"
        cardImage={
          <Image src="/favicon.ico" width={56} height={56} alt="그리담로고" className=" mx-auto " />
        }
        cardTitle={<h1 className="text-4xl mb-2 text-navy-gray">회원가입</h1>}
        cardDescription={<p className="text-lg">그리담과 함께 시작해요</p>}
      />

      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 ">
            <label htmlFor="nickname" className="text-lg text-left font-semibold">
              닉네임
            </label>
            <Input
              type="text"
              {...register('nickname')}
              id="nickname"
              className="w-full"
              placeholder="귀여운 닉네임"
            />
          </div>
          <div className="flex flex-col gap-2 ">
            <label htmlFor="email" className="text-lg  text-left font-semibold">
              이메일
            </label>
            <Input
              type="text"
              {...register('email')}
              id="email"
              className="w-full"
              placeholder="your@email.com"
            />
          </div>
          <div className="flex flex-col gap-2 ">
            <label htmlFor="password" className="text-lg text-left font-semibold">
              비밀번호
            </label>
            <Input
              type="password"
              {...register('password')}
              id="password"
              className="w-full"
              placeholder="• • • • • • • •"
            />
          </div>
          <div className="flex flex-col gap-2 ">
            <label htmlFor="confirmPassword" className="text-lg text-left font-semibold">
              비밀번호 확인
            </label>
            <Input
              type="password"
              {...register('confirmPassword')}
              id="confirmPassword"
              className="w-full"
              placeholder="• • • • • • • •"
            />
          </div>
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full text-xl"
            label={'가입하기'}
          />
        </form>
      </CardBody>

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
