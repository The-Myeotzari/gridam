'use client'

import Link from 'next/link'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { toast } from '@/store/toast-store'
import { useEffect, useState, Suspense } from 'react'
import { loginAction } from '@/features/auth/login/api/login-action'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

function LoginMessageToast() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  useEffect(() => {
    if (message) toast.error(message)
  }, [message])

  return null
}

export default function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)

    const result = await loginAction(formData)

    if (result.ok) {
      toast.success(result.message)
      router.push('/')
    } else {
      toast.error(result.message)
    }

    setLoading(false)
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <Suspense fallback={null}>
        <LoginMessageToast />
      </Suspense>

      <Card className="w-full max-w-md p-8 paper-texture crayon-border animate-fade-in mx-auto my-auto shadow-card">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <Image
            src="/favicon.ico"
            alt="그리담 로고"
            width={56}
            height={56}
            className="mx-auto mb-3"
            style={{ width: 'auto', height: 'auto' }}
          />
          <h1 className="text-3xl font-extrabold">그리담 GRIDAM</h1>
          <p className="text-muted-foreground">오늘의 이야기를 그려요</p>
        </div>

        {/* 바디 */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-2">
            <label className="font-handwritten text-lg font-bold" htmlFor="email">
              이메일
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="useremail"
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
              autoComplete="current-password"
              placeholder="••••••••"
              className="font-handwritten text-lg rounded-xl h-12 w-full"
            />
          </div>

          <Button
            type="submit"
            variant="basic"
            label={loading ? '로그인 중...' : '로그인'}
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
