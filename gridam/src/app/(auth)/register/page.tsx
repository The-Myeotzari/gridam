'use client'
import Button from '@/components/ui/button'
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Link from 'next/link'
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from '@/store/toast-store'
import { MESSAGES } from '@/constants/messages'
import Image from 'next/image'
import Toast from '@/components/ui/toast'
import { useMutation } from '@tanstack/react-query'

interface RegisterFormData {
  nickname: string
  email: string
  password: string
  confirmPassword: string
}
//유효성 검사 - 비밀번호, 이메일, 닉네임
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;/']).{8,}$/
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]{2,12}$/

// api 불러오기
async function registerUser(data: Pick<RegisterFormData, 'nickname' | 'email' | 'password'>) {
  const { nickname, email, password } = data
  const res = await fetch('/apis/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const result = await res.json()

  if (res.ok) return result
  if (result.message?.includes('already registered')) {
    //닉네임은?
    //이메일 중복 검사
    // Supabase가 이메일 중복 시 에러 메시지 반환
    throw new Error('이미 사용 중인 이메일입니다.')
  }
  throw new Error(result.message || MESSAGES.AUTH.ERROR.REGISTER)
  return result
}
export default function RegisterForm() {
  //입력할 때마다 유효성 검증
  const { register, handleSubmit, watch, formState, reset } = useForm<RegisterFormData>({
    mode: 'onSubmit',
  })

  //버튼 상태 관리
  const { isValid, isSubmitting } = formState

  //TanstackQuery-useMutaion 활용
  const mutation = useMutation({
    mutationFn: (data: RegisterFormData) => registerUser(data),
    onSuccess: () => {
      toast.success(MESSAGES.AUTH.SUCCESS.REGISTER)
      reset()
    },
    onError: (error) => {
      toast.error(error.message || MESSAGES.AUTH.ERROR.REGISTER)
    },
  })
  //유효성 통과 시
  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    const { nickname, email, password, confirmPassword } = data
    const { errors } = formState
    mutation.mutate(data)
  }
  // 유효성 실패 시
  const onInvalid = (errors: FieldErrors<RegisterFormData>) => {
    //1. 첫 번째 필드에 오류가 발생한 필드의 키(이름) 찾기
    const firstErrorKey = Object.keys(errors)[0] as keyof RegisterFormData | undefined
    if (!firstErrorKey) return

    //2. 오류의 타입이 required인지 확인하여 빈 값 오류 우선 처리
    const firstError = errors[firstErrorKey]
    if (firstError?.type === 'required') {
      toast.error(MESSAGES.AUTH.ERROR.EMPTY_FORM)
      return
    }
    //3. required가 아닌 형식 오류 (validate)인 경우
    if (firstError?.message) {
      toast.error(firstError.message)
    }
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
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 ">
            <label htmlFor="nickname" className="text-lg text-left font-semibold">
              닉네임
            </label>
            <Input
              type="text"
              {...register('nickname', {
                validate: (value) => {
                  if (!NICKNAME_REGEX.test(value)) {
                    return MESSAGES.AUTH.ERROR.INVALID_NICKNAME_FORMAT
                  }
                },
                required: true,
              })}
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
              {...register('email', {
                validate: (value) => {
                  if (!EMAIL_REGEX.test(value)) {
                    return MESSAGES.AUTH.ERROR.INVALID_EMAIL_FORMAT
                  }
                },
                required: true,
              })}
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
              {...register('password', {
                validate: (value) => {
                  if (value.length < 8) return MESSAGES.AUTH.ERROR.INVALID_PASSWORD_LENGTH

                  if (!PASSWORD_REGEX.test(value))
                    return MESSAGES.AUTH.ERROR.INVALID_PASSWORD_FORMAT

                  return true
                },
                required: true,
              })}
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
              {...register('confirmPassword', {
                validate: (value) => {
                  if (value !== watch('password')) return MESSAGES.AUTH.ERROR.WRONG_PASSWORD
                },
                required: true,
              })}
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
            // disabled={!formState.isValid || formState.isSubmitting}
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
