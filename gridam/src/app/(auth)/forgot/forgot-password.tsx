'use client'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { forgetAction } from '@/features/auth/forgot/api/forgot-action'
import ForgotSubmitButton from '@/features/auth/forgot/components/forgot-submit-button'
import Form from 'next/form'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useFormState } from 'react-dom'
import { useActionState, useEffect } from 'react'
import Toast from '@/components/ui/toast'
import { email } from 'zod'
import { toast } from '@/store/toast-store'
import { MESSAGES } from '@/constants/messages'

interface ForgotPasswordProps {
  isSubmitted: boolean //URL 쿼리에서 해석된 값
  email: string //URL쿼리에서 해석된 값
  error: string //useActionState의 state.error로 처리됨.
}
//유효성 검사 - 이메일
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

export default function ForgotPassword({ isSubmitted, email, error }: ForgotPasswordProps) {
  // 성공 토스트
  useEffect(() => {
    if (isSubmitted && email) {
      toast.success(`${email}로 전송된 인증 링크를 확인해주세요.`)
    }
  }, [isSubmitted, email])

  // 에러 토스트
  useEffect(() => {
    if (state.error) {
      toast.error(state.error)
    }
  }, [state.error])
  //state.error는 api요청 실패 시 에러 메시지를 담고, 성공 시에는 'redirect가 발생함.
  // ✅ 여기에서 클라이언트 검증 + 서버 액션 래핑
  const [state, formAction] = useActionState(
    async (prevState: { error: string }, formData: FormData) => {
      const emailValue = (formData.get('email') || '') as string

      if (!emailValue) {
        toast.error(MESSAGES.AUTH.ERROR.EMPTY_EMAIL)
        return { error: MESSAGES.AUTH.ERROR.EMPTY_EMAIL }
      }
      if (!EMAIL_REGEX.test(emailValue)) {
        toast.error(MESSAGES.AUTH.ERROR.INVALID_EMAIL_FORMAT)
        return { error: MESSAGES.AUTH.ERROR.EMPTY_EMAIL }
      }

      return await forgetAction(prevState, formData)
    },
    { error: '' }
  )

  return (
    <>
      <Toast />
      {!isSubmitted ? (
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
            {error ? <p className="text-sm text-destructive font-handwritten">{error}</p> : null}
          </div>

          <ForgotSubmitButton className="w-full font-handwritten text-xl rounded-full h-12 bg-linear-to-r from-primary to-secondary hover:opacity-90" />
        </Form>
      ) : (
        // 재설정 링크 전송 버튼 눌럿을 떄
        //이메일 인증 하기
        <div className="space-y-6">
          <div className="bg-primary/10 rounded-xl p-6 text-center">
            <p className="font-handwritten text-lg text-navy-gray mb-2">{email}</p>
            <p className="font-handwritten text-base text-muted-foreground">
              위 이메일로 비밀번호 재설정 링크를 전송했습니다. 이메일을 확인하고 링크를
              클릭해주세요.
            </p>
          </div>
          {/* 오류났으 ㄹ떄 */}
          {/* 못 받았을 경우 다시 시도하기 버튼 생성 */}
          <div className="text-center space-y-3">
            <p className="font-handwritten text-sm text-muted-foreground">
              이메일을 받지 못하셨나요?
            </p>
            <Link href="/forgot">
              <Button
                type="button"
                variant="gradient"
                label="다시 시도하기"
                className="font-handwritten text-base rounded-full"
              />
            </Link>
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <div className="font-handwritten text-base text-muted-foreground">
          계정이 없으신가요?{' '}
          <a href="/signup" className="text-primary hover:underline">
            회원가입
          </a>
        </div>
      </div>
    </>
  )
}
