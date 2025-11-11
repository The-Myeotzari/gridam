'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/card'
import { toast } from '@/store/toast-store'
import { MESSAGES } from '@/constants/messages'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email && !password) return toast.error(MESSAGES.AUTH.ERROR.EMPTY_EMAIL_PASSWORD)
    if (!email) return toast.error(MESSAGES.AUTH.ERROR.EMPTY_EMAIL)
    if (!password) return toast.error(MESSAGES.AUTH.ERROR.INVALID_PASSWORD_LENGTH)

    toast.success(MESSAGES.AUTH.SUCCESS.LOGIN)
  }

  return (
    <Card className="w-full max-w-[420px] shadow-card" indent="none">
      {/* 헤더 */}
      <CardHeader
        align="vertical"
        iconSize="md"
        className="text-center"
        cardImage={<img src="/favicon.ico" alt="그리담 로고" width={56} height={56} />}
        cardTitle={<h1 className="text-3xl font-extrabold">그리담 GRIDAM</h1>}
        cardDescription={<span>오늘의 이야기를 그려요</span>}
      />

      {/* 바디 */}
      <CardBody className="px-8">
        <form onSubmit={handleLogin} className="mt-4 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">이메일</span>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full h-11 rounded-xl border border-input bg-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">비밀번호</span>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 rounded-xl border border-input bg-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            isActive
            label="로그인"
            className="w-full mt-2"
          />
        </form>
      </CardBody>

      {/* 푸터 */}
      <CardFooter className="px-8 flex-col gap-2 text-center text-sm">
        <Link href="/forgot" className="text-muted-foreground hover:underline">
          비밀번호를 잊으셨나요?
        </Link>
        <div className="text-muted-foreground">
          <span className="p-1">계정이 없으신가요?</span>
          <Link href="/register" className="font-semibold text-primary hover:underline">
            회원가입
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
