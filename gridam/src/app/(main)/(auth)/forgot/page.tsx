'use client'

import Button from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { ForgotPasswordInput, requestPasswordReset } from '@/features/auth/forgot/api/forgot.api'
import { AuthHeader } from '@/features/auth/forgot/components/forgot-header'
import { useForgotPasswordStore } from '@/features/auth/forgot/store/forget-store'
import { toast } from '@/store/toast-store'
import { useMutation } from '@tanstack/react-query'
import * as React from 'react'
import { useForm } from 'react-hook-form'

export default function Page() {
  const { email, isSubmitted, setEmail, setSubmitted, reset } = useForgotPasswordStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ForgotPasswordInput>({
    mode: 'onSubmit',
    defaultValues: { email },
  })

  React.useEffect(() => {
    setValue('email', email)
  }, [email, setValue])

  const mutation = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: () => {
      toast.success('비밀번호 재설정 링크를 이메일로 전송했습니다!')
      setSubmitted(true)
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : '요청 처리 중 오류가 발생했어요.'
      toast.error(message)
    },
  })

  const onSubmit = (values: ForgotPasswordInput) => {
    setEmail(values.email)
    return mutation.mutate(values)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-36 h-36 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <Card className="w-full max-w-md p-8 paper-texture crayon-border animate-fade-in">
        <AuthHeader
          title="비밀번호 찾기"
          subtitle={isSubmitted ? '이메일을 확인해주세요' : '가입하신 이메일을 입력해주세요'}
        />

        {!isSubmitted ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-handwritten text-lg">
                이메일
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="font-handwritten text-lg rounded-xl h-12 w-full"
                {...register('email')}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-sm text-destructive font-handwritten">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              // disabled={isSubmitting || mutation.isPending}
              label={mutation.isPending ? '전송 중...' : '재설정 링크 전송'}
              className="w-full font-handwritten text-xl rounded-full h-12 bg-linear-to-r from-primary to-secondary hover:opacity-90"
            />
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-primary/10 rounded-xl p-6 text-center">
              <p className="font-handwritten text-lg text-navy-gray mb-2">{email}</p>
              <p className="font-handwritten text-base text-muted-foreground">
                위 이메일로 비밀번호 재설정 링크를 전송했습니다. 이메일을 확인하고 링크를
                클릭해주세요.
              </p>
            </div>

            <div className="text-center space-y-3">
              <p className="font-handwritten text-sm text-muted-foreground">
                이메일을 받지 못하셨나요?
              </p>
              <Button
                variant="gradient"
                onClick={reset}
                label="다시 시도하기"
                className="font-handwritten text-base rounded-full"
              />
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
      </Card>
    </div>
  )
}
