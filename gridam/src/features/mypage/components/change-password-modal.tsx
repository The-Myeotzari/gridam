'use client'

import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import { ModalBody, ModalHeader } from "@/components/ui/modal/modal";
import { ChangePasswordFormSchema } from "@/types/zod/apis/auth";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useChangePassword } from "@/features/mypage/api/queries/use-change-password";
import { toast } from "@/store/toast-store";
import { MESSAGES } from "@/constants/messages";
import Button from "@/components/ui/button";
import { AxiosError } from "axios";

type ChangePasswordForm = z.infer<typeof ChangePasswordFormSchema>

export default function ChangePasswordModal({ close }: { close: () => void }) {
  const { register, formState: { isSubmitting }, handleSubmit, reset } = useForm<ChangePasswordForm>()


  // TODO: 비밀번호 변경 API 연동, 유효성 검사
  const { mutateAsync, isPending } = useChangePassword()

  const onSubmit = async (values: ChangePasswordForm) => {
    try {
      const { password, newPassword, confirmPassword } = values
      const res = await mutateAsync({ password, newPassword, confirmPassword })

      if (!res.ok) {
        toast.error(res.message ?? MESSAGES.AUTH.ERROR.PASSWORD_RESET)
        return
      }

      toast.success(res.message ?? MESSAGES.AUTH.SUCCESS.PASSWORD_RESET)
      reset()
      close()
    } catch (err) {
      const message = err instanceof AxiosError ? err.response?.data.message : MESSAGES.AUTH.ERROR.PASSWORD_RESET
      toast.error(message)
    }
  }

  const loading = isSubmitting || isPending

  return (
    <>
      <ModalHeader
        align='horizontal'
        cardTitle={<h1 className='text-2xl font-bold'>비밀번호 변경</h1>}
        cardDescription='새로운 비밀번호를 입력해주세요'
        right={<X className='absolute top-6 right-6 size-4 cursor-pointer' onClick={() => close()} />}
      />
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <Label htmlFor='current-password' className='font-bold'>현재 비밀번호</Label>
          <Input
            id='current-password'
            type='password'
            className='w-full'
            placeholder="• • • • • • • •"
            {...register('password')}
          />
          <Label htmlFor='new-password' className='font-bold'>새 비밀번호</Label>
          <Input
            id='new-password'
            type='password'
            className='w-full'
            placeholder="• • • • • • • •"
            disabled={isSubmitting}
            {...register('newPassword')}
          />
          <Label htmlFor='confirm-new-password' className='font-bold'>새 비밀번호 확인</Label>
          <Input
            id='confirm-new-password'
            type='password'
            className='w-full'
            placeholder="• • • • • • • •"
            disabled={isSubmitting}
            {...register('confirmPassword')}
          />
          <span className={loading ? "pointer-events-none opacity-50" : ""}>
            <Button
              type="submit"
              variant='gradient'
              label={loading ? '변경 중...' : '변경하기'}
              size='lg'
              className='w-full'
            />
          </span>
        </form>
      </ModalBody>
    </>
  )
}