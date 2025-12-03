'use client'

import { changePasswordAction } from '@/features/mypage/api/change-action' 
import { MESSAGES } from '@/shared/constants/messages'
import { ChangePasswordFormSchema } from '@/shared/types/zod/apis/auth'
import ClientButton from '@/shared/ui/client-button'
import Input from '@/shared/ui/input'
import Label from '@/shared/ui/label'
import { ModalBody, ModalHeader } from '@/shared/ui/modal/modal'
import { toast } from '@/store/toast-store'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import z from 'zod'

type ChangePasswordForm = z.infer<typeof ChangePasswordFormSchema>

export default function ChangePasswordModal({ close }: { close: () => void }) {
  const {
    register,
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = useForm<ChangePasswordForm>()

  const onSubmit = async (values: ChangePasswordForm) => {
    const res = await changePasswordAction(values)

    if (!res.ok) {
      toast.error(res.message ?? MESSAGES.AUTH.ERROR.PASSWORD_RESET)
      return
    }

    toast.success(res.data.message ?? MESSAGES.AUTH.SUCCESS.PASSWORD_RESET)
    reset()
    close()
  }

  return (
    <>
      <ModalHeader
        align="horizontal"
        cardTitle={<h1 className="text-2xl font-bold">비밀번호 변경</h1>}
        cardDescription="새로운 비밀번호를 입력해주세요"
        right={
          <X className="absolute top-6 right-6 size-4 cursor-pointer" onClick={() => close()} />
        }
      />
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Label htmlFor="current-password" className="font-bold">
            현재 비밀번호
          </Label>
          <Input
            id="current-password"
            type="password"
            className="w-full"
            placeholder="• • • • • • • •"
            {...register('password')}
          />
          <Label htmlFor="new-password" className="font-bold">
            새 비밀번호
          </Label>
          <Input
            id="new-password"
            type="password"
            className="w-full"
            placeholder="• • • • • • • •"
            disabled={isSubmitting}
            {...register('newPassword')}
          />
          <Label htmlFor="confirm-new-password" className="font-bold">
            새 비밀번호 확인
          </Label>
          <Input
            id="confirm-new-password"
            type="password"
            className="w-full"
            placeholder="• • • • • • • •"
            disabled={isSubmitting}
            {...register('confirmPassword')}
          />
          <ClientButton
            type="submit"
            variant="gradient"
            label={isSubmitting ? '변경 중...' : '변경하기'}
            size="lg"
            className={`w-full ${isSubmitting && 'pointer-events-none opacity-50'}`}
          />
        </form>
      </ModalBody>
    </>
  )
}
