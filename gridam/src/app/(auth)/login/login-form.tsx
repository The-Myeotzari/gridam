'use client'

import { loginAction } from '@/features/auth/login/api/login-action'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import SocialLoginButtons from './login-button'
import { toast } from '@/store/toast-store'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function formAction(formData: FormData) {
    setLoading(true)

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
    <form action={formAction} className="space-y-6" noValidate>
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

      <SocialLoginButtons />

      <Button
        type="submit"
        variant="basic"
        label={loading ? '로그인 중...' : '로그인'}
        className="w-full font-handwritten text-xl rounded-full h-12 bg-linear-to-r from-primary to-secondary hover:opacity-90"
      />
    </form>
  )
}
