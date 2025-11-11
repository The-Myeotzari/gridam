'use client'

import { toast } from '@/store/toast-store'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import Button from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { AuthHeader } from '@/features/auth/forgot/components/forgot-header'
import { FormValues, resetPasswordRequest } from '@/features/auth/reset/api/reset.api'

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const token = params?.token

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onSubmit',
  })

  const onSubmit = async (values: FormValues) => {
    try {
      if (!token) throw new Error('유효하지 않은 링크입니다.')
      await resetPasswordRequest(token, values)
      toast.success('비밀번호가 변경되었어요. 다시 로그인해 주세요!')
      router.replace('/login')
    } catch (err) {
      const message = err instanceof Error ? err.message : '요청 처리 중 오류가 발생했어요.'
      toast.error(message)
    }
  }

  const password = watch('password')

  return (
    <div className="flex-1 flex item-center justify-center">
      <Card className="w-full max-w-md p-8 paper-texture crayon-border animate-fade-in mx-auto my-auto">
        <AuthHeader title="비밀번호 재설정" subtitle="새 비밀번호를 입력해주세요" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-handwritten text-lg font-bold">
              새 비밀번호
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              className="font-handwritten text-lg rounded-xl h-12 w-full"
              {...register('password', {
                required: '비밀번호를 입력해주세요!',
                minLength: { value: 8, message: '8자 이상으로 입력해주세요.' },
              })}
            />
            {errors.password && (
              <p className="text-sm text-destructive font-handwritten">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="font-handwritten text-lg font-bold">
              비밀번호 확인
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="font-handwritten text-lg rounded-xl h-12 w-full"
              {...register('confirmPassword', {
                required: '비밀번호를 다시 입력해주세요!',
                validate: (v) => v === password || '비밀번호가 일치하지 않습니다.',
              })}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive font-handwritten">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="basic"
            label={isSubmitting ? '변경 중...' : '비밀번호 변경'}
            // disabled={isSubmitting}
            className="w-full font-handwritten text-xl rounded-full h-12 bg-linear-to-r from-primary to-secondary hover:opacity-90"
          />
        </form>

        <div className="mt-6 text-center">
          <div className="font-handwritten text-base text-muted-foreground">
            비밀번호를 기억하셨나요?{' '}
            <a href="/login" className="text-primary hover:underline">
              로그인
            </a>
          </div>
        </div>
      </Card>
    </div>
  )
}
