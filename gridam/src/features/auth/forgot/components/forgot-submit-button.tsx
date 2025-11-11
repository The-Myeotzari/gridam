'use client'

import Button from '@/components/ui/button'
import cn from '@/utils/cn'
import { ComponentProps } from 'react'
import { useFormStatus } from 'react-dom'

type Props = Omit<ComponentProps<typeof Button>, 'label' | 'children'>

export default function ForgotSubmitButton({ className, ...props }: Props) {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      size="lg"
      aria-disabled={pending}
      label={pending ? '전송 중...' : '재설정 링크 전송'}
      className={cn('rounded-full h-12', className)}
      {...props}
    />
  )
}
