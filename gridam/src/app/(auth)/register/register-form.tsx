'use client'
import { CardBody } from '@/components/ui/card'
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form'
import { MESSAGES } from '@/constants/messages'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from '@/store/toast-store'
import { registerUser } from '@/features/auth/register/api/register.api'
import Button from '@/components/ui/button'
import { QUERY_KEYS } from '@/constants/query-key'
import RegisterInput from '@/features/auth/register/components/register-input'
import { RegisterFormData } from '@/features/auth/register/types/register'
import { useRouter } from 'next/navigation'

//유효성 검사 - 비밀번호, 이메일, 닉네임
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;/']).{8,}$/
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]{2,12}$/

export default function RegisterForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { register, handleSubmit, getValues, formState, reset } = useForm<RegisterFormData>({
    mode: 'onSubmit',
  })

  //비동기 요청 (로딩, 성공, 실패)
  const mutation = useMutation({
    mutationFn: (data: RegisterFormData) => registerUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.AUTH.ME] })
      toast.success(MESSAGES.AUTH.SUCCESS.REGISTER_AND_EMAIL)
      router.push('/login')
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
    <CardBody>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex flex-col gap-4">
        <RegisterInput
          label="닉네임"
          name="nickname"
          placeholder="귀여운 닉네임"
          register={register}
          validation={{
            required: true,
            validate: (value) =>
              NICKNAME_REGEX.test(value) || MESSAGES.AUTH.ERROR.INVALID_NICKNAME_FORMAT,
          }}
        />

        <RegisterInput
          label="이메일"
          type="text"
          name="email"
          placeholder="your@email.com"
          register={register}
          validation={{
            required: true,
            validate: (value) =>
              EMAIL_REGEX.test(value) || MESSAGES.AUTH.ERROR.INVALID_EMAIL_FORMAT,
          }}
        />

        <RegisterInput
          label="비밀번호"
          type="password"
          name="password"
          placeholder="• • • • • • • •"
          register={register}
          validation={{
            required: true,
            validate: (value) => {
              if (value.length < 8) return MESSAGES.AUTH.ERROR.INVALID_PASSWORD_LENGTH
              if (!PASSWORD_REGEX.test(value)) return MESSAGES.AUTH.ERROR.INVALID_PASSWORD_FORMAT
              return true
            },
          }}
        />

        <RegisterInput
          label="비밀번호 확인"
          type="password"
          name="confirmPassword"
          placeholder="• • • • • • • •"
          register={register}
          validation={{
            required: true,
            validate: (value) =>
              value === getValues('password') || MESSAGES.AUTH.ERROR.WRONG_PASSWORD,
          }}
        />
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
  )
}
