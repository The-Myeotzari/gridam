import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import { ModalBody, ModalHeader } from "@/components/ui/modal/modal";
import { PASSWORD_REGEX } from "@/types/zod/apis/auth";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

const ChangePasswordFormSchema = z.object({
  password: z.string().min(8),
  newPassword: z.string().min(8).regex(PASSWORD_REGEX),
  confirmPassword: z.string().min(8)
})

type ChangePasswordForm = z.infer<typeof ChangePasswordFormSchema>

export default function ChangePasswordModal({ close }: { close: () => void }) {
  const { register, formState: { errors, isSubmitting }, handleSubmit } = useForm<ChangePasswordForm>()

  // TODO: 비밀번호 변경 API 연동
  const handleFormSubmit = (payload: ChangePasswordForm) => {
    console.log(payload)
  }

  return (
    <>
      <ModalHeader
        align='horizontal'
        cardTitle={<h1 className='text-2xl font-bold'>비밀번호 변경</h1>}
        cardDescription='새로운 비밀번호를 입력해주세요'
        right={<X className='absolute top-6 right-6 size-4 cursor-pointer' onClick={() => close()} />}
      />
      <ModalBody>
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
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
            {...register('newPassword')}
          />
          <Label htmlFor='confirm-new-password' className='font-bold'>새 비밀번호 확인</Label>
          <Input
            id='confirm-new-password'
            type='password'
            className='w-full'
            placeholder="• • • • • • • •"
            {...register('confirmPassword')}
          />
          <Button
            type='submit'
            variant='gradient'
            label='변경하기'
            size='lg'
            className='w-full'
          />
        </form>
      </ModalBody>
    </>
  )
}