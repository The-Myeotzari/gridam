'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

import { loginAction } from '@/features/auth/login/api/login.action'
import Button from '@/shared/ui/button'
import Input from '@/shared/ui/input'
import { toast } from '@/store/toast-store'
import SocialLoginButtons from './login-button'

import LoadingOverlay from '@/shared/ui/three/loading-overlay'
import { useSmoothProgress } from '@/shared/hooks/use-smooth-progress'

export default function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { open, progress } = useSmoothProgress(loading)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
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
    <>
      {/* 3D 로딩 스피너 */}
      <LoadingOverlay open={open} label="로그인 중..." progress={progress} />

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

        <SocialLoginButtons setLoading={setLoading} />

        <Button
          type="submit"
          variant="basic"
          label={loading ? '로그인 중...' : '로그인'}
          className="w-full font-handwritten text-xl rounded-full h-12 bg-linear-to-r from-primary to-secondary hover:opacity-90"
        />
      </form>
    </>
  )
}
