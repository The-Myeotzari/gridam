'use client'
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Toast from '@/components/ui/toast'
import Image from 'next/image'
import Link from 'next/link'
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form'
import { MESSAGES } from '@/constants/messages'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from '@/store/toast-store'
import { registerUser } from '@/features/auth/register/api/register-actions'
import Button from '@/components/ui/button'
import { QUERY_KEYS } from '@/constants/query-key'

export interface RegisterFormData {
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

export default function RegisterForm() {
  const queryClient = useQueryClient()
  const { register, handleSubmit, getValues, formState, reset } = useForm<RegisterFormData>({
    mode: 'onSubmit',
  })

  //비동기 요청 (로딩, 성공, 실패)
  const mutation = useMutation({
    mutationFn: (data: RegisterFormData) => registerUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.AUTH.ME] })
      toast.success(MESSAGES.AUTH.SUCCESS.REGISTER)
      reset()
    },
    onError: (error) => {
      toast.error(error.message || MESSAGES.AUTH.ERROR.REGISTER)
    },
  })

  //유효성 통과 시
  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
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
    <>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 ">
            <label htmlFor="nickname" className="text-lg text-left font-semibold">
              닉네임
            </label>
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
                  if (value !== getValues('password')) return MESSAGES.AUTH.ERROR.WRONG_PASSWORD
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
            className="w-full text-xl disabled:cursor-not-allowed disabled:from-gray-300         // 그라데이션 시작 색 회색
                disabled:to-gray-300 disabled:text-gray-500 disabled:opacity-70"
            disabled={mutation.isPending}
            label={'가입하기'}
          />
        </form>
      </CardBody>
    </>
  )
}
