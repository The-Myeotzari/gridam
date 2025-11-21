'use client'
import Button from '@/shared/ui/button'
import Input from '@/shared/ui/input'
import Label from '@/shared/ui/label'
import { forgetAction } from '@/features/auth/forgot/api/forgot-action'
import Form from 'next/form'
import Link from 'next/link'
import { startTransition, useActionState } from 'react'
import Toast from '@/shared/ui/toast'
import { toast } from '@/store/toast-store'

import ForgotButton from './forgot-button'
import { MESSAGES } from '@/shared/constants/messages'
import ClientButton from '@/shared/ui/client-button'

interface ForgotState {
  isSubmitted: boolean //URL 쿼리에서 해석된 값
  email: string //URL쿼리에서 해석된 값
  error: string | null //useActionState의 state.error로 처리됨.
}
//유효성 검사 - 이메일
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

export default function ForgotPassword({ isSubmitted, email, error }: ForgotState) {
  const [state, formAction] = useActionState<ForgotState, FormData>(
    async (prevState, formData: FormData) => {
      const isReset = formData.get('reset') === 'true'
      const emailValue = (formData.get('email') || '') as string
      const result = await forgetAction(prevState, formData)

      if (isReset) {
        return { error: null, isSubmitted: false, email: '' }
      }
      if (!emailValue) {
        toast.error(MESSAGES.AUTH.ERROR.EMPTY_EMAIL)
        return { ...prevState, error: MESSAGES.AUTH.ERROR.EMPTY_EMAIL, isSubmitted: false }
      }
      if (!EMAIL_REGEX.test(emailValue)) {
        toast.error(MESSAGES.AUTH.ERROR.INVALID_EMAIL_FORMAT)
        return { ...prevState, error: MESSAGES.AUTH.ERROR.EMPTY_EMAIL, isSubmitted: false }
      }

      if (result.error) {
        toast.error(MESSAGES.AUTH.ERROR.EMAIL_VERIFICATION_REQUEST_FAILED)

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
  const resetForm = () => {
    const data = new FormData()
    data.append('reset', 'true')
    formAction(data)
  }
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
          <ForgotButton />
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
            <ClientButton
              type="submit"
              variant="gradient"
              label="다시 시도하기"
              className="font-handwritten text-base rounded-full"
              onClick={() => {
                startTransition(() => {
                  resetForm()
                })
              }}
            />
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
