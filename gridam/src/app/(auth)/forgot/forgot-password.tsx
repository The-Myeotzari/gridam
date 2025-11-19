'use client'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { forgetAction } from '@/features/auth/forgot/api/forgot-action'
import ForgotSubmitButton from '@/features/auth/forgot/components/forgot-submit-button'
import Form from 'next/form'
import Link from 'next/link'
import { useActionState } from 'react'
import Toast from '@/components/ui/toast'

import { toast } from '@/store/toast-store'
import { MESSAGES } from '@/constants/messages'

import { useRouter } from 'next/navigation'

interface ForgotState {
  isSubmitted: boolean //URL 쿼리에서 해석된 값
  email: string //URL쿼리에서 해석된 값
  error: string | null //useActionState의 state.error로 처리됨.
}
//유효성 검사 - 이메일
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

export default function ForgotPassword({ isSubmitted, email, error }: ForgotState) {
  //state.error는 api요청 실패 시 에러 메시지를 담고, 성공 시에는 'redirect가 발생함.
  // ✅ 여기에서 클라이언트 검증 + 서버 액션 래핑
  const router = useRouter()
  const [state, formAction] = useActionState<ForgotState, FormData>(
    async (prevState, formData: FormData) => {
      const emailValue = (formData.get('email') || '') as string
      if (!emailValue) {
        toast.error(MESSAGES.AUTH.ERROR.EMPTY_EMAIL)
        return { ...prevState, error: MESSAGES.AUTH.ERROR.EMPTY_EMAIL, isSubmitted: false }
      }
      if (!EMAIL_REGEX.test(emailValue)) {
        toast.error(MESSAGES.AUTH.ERROR.INVALID_EMAIL_FORMAT)
        return { ...prevState, error: MESSAGES.AUTH.ERROR.EMPTY_EMAIL, isSubmitted: false }
      }

      const result = await forgetAction(prevState, formData)

      if (result.error) {
        toast.error(MESSAGES.AUTH.ERROR.EMAIL_VERIFICATION_REQUEST_FAILED)
        // router.push(`/reset`)
        return {
          ...prevState,
          error: MESSAGES.AUTH.ERROR.EMAIL_VERIFICATION_REQUEST_FAILED,
          isSubmitted: false,
        }
      }
      toast.success(MESSAGES.AUTH.SUCCESS.PASSWORD_RESET_EMAIL)
      return {
        error: null,
        isSubmitted: true,
        email: emailValue,
      }
    },
    { error: null, isSubmitted: false, email: '' }
  )

  return (
    <>
      <Toast />
      {!state.isSubmitted ? (
        <Form action={formAction} className="space-y-6" noValidate>
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
            {state.error ? (
              <p className="text-sm text-destructive font-handwritten">{state.error}</p>
            ) : null}
          </div>

          <ForgotSubmitButton className="w-full font-handwritten text-xl rounded-full h-12 bg-linear-to-r from-primary to-secondary hover:opacity-90" />
        </Form>
      ) : (
        <div className="space-y-6">
          <div className="bg-primary/10 rounded-xl p-6 text-center">
            <p className="font-handwritten text-lg text-navy-gray mb-2">{state.email}</p>
            <p className="font-handwritten text-base text-muted-foreground">
              위 이메일로 비밀번호 재설정 링크를 전송했습니다. 이메일을 확인하고 링크를
              클릭해주세요.
            </p>
          </div>
          <div className="text-center space-y-3">
            <p className="font-handwritten text-sm text-muted-foreground">
              이메일을 받지 못하셨나요?
            </p>
            <Link href={`/forgot`}>
              <Button
                type="button"
                variant="gradient"
                label="다시 시도하기"
                className="font-handwritten text-base rounded-full"
                onClick={() => {
                  router.refresh()
                }}
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
    </>
  )
}
