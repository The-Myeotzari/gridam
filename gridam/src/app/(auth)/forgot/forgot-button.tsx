'use client'
import Button from '@/components/ui/button'
import { useFormStatus } from 'react-dom'

export default function ForgotButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      size="lg"
      variant="gradient"
      disabled={pending}
      label={pending ? '전송 중...' : '재설정 링크 전송'}
      className="w-full text-xl hover:opacity-90"
    />
  )
}
