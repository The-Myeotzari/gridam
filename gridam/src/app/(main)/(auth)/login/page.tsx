'use client'

import Link from 'next/link'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { toast } from '@/store/toast-store'
import { useEffect, useActionState } from 'react'
import { loginAction, type LoginResult } from '@/features/auth/login/api/login-action'

export default function LoginForm() {
  const [state, formAction] = useActionState<LoginResult | null, FormData>(loginAction, null)

  useEffect(() => {
    if (!state) return
    state.ok ? toast.success(state.message) : toast.error(state.message)
  }, [state])

  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="w-full max-w-md p-8 paper-texture crayon-border animate-fade-in mx-auto my-auto shadow-card">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <img
            src="/favicon.ico"
            alt="그리담 로고"
            width={56}
            height={56}
            className="mx-auto mb-3"
          />
          <h1 className="text-3xl font-extrabold">그리담 GRIDAM</h1>
          <p className="text-muted-foreground">오늘의 이야기를 그려요</p>
        </div>

        {/* 바디 */}
        <form action={formAction} className="space-y-6" noValidate>
          <div className="space-y-2">
            <label className="font-handwritten text-lg font-bold" htmlFor="email">
              이메일
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              className="font-handwritten text-lg rounded-xl h-12 w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="font-handwritten text-lg font-bold" htmlFor="password">
              비밀번호
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="font-handwritten text-lg rounded-xl h-12 w-full"
            />
          </div>

          <Button
            type="submit"
            variant="basic"
            label="로그인"
            className="w-full font-handwritten text-xl rounded-full h-12 bg-linear-to-r from-primary to-secondary hover:opacity-90"
          />
        </form>

        {/* 푸터 */}
        <div className="mt-6 text-center font-handwritten text-base text-muted-foreground">
          <Link href="/forgot" className="hover:underline">
            비밀번호를 잊으셨나요?
          </Link>
          <div className="mt-3">
            계정이 없으신가요?{' '}
            <Link href="/register" className="text-primary hover:underline font-semibold">
              회원가입
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
