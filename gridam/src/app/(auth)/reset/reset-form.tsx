'use client'
import Button from '@/shared/ui/button'
import Input from '@/shared/ui/input'
import Label from '@/shared/ui/label'
import { resetAction } from '@/features/auth/reset/api/reset-action'
import { useActionState } from 'react'
import { toast } from '@/store/toast-store'
import { MESSAGES } from '@/shared/constants/messages'

type ResetFormProps = {
  token: string
}
type ResetState = {
  error: string | null
  isSuccess: boolean
  success?: string | null
}
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;/']).{8,}$/

export default function ResetForm({ token }: ResetFormProps) {
  const [state, formAction] = useActionState<ResetState, FormData>(
    async (prevState, formData: FormData) => {
      const password = formData.get('password') as string
      const confirmPassword = formData.get('confirmPassword') as string

      if (!password || !confirmPassword) {
        toast.error(MESSAGES.AUTH.ERROR.EMPTY_FORM)
        return { error: MESSAGES.AUTH.ERROR.EMPTY_FORM, isSuccess: false }
      }
      if (password !== confirmPassword) {
        toast.error(MESSAGES.AUTH.ERROR.WRONG_CURRENT_PASSWORD)
        return { error: MESSAGES.AUTH.ERROR.WRONG_CURRENT_PASSWORD, isSuccess: false }
      }
      if (password.length < 8) {
        toast.error(MESSAGES.AUTH.ERROR.INVALID_PASSWORD_LENGTH)
        return { error: MESSAGES.AUTH.ERROR.INVALID_PASSWORD_LENGTH, isSuccess: false }
      }
      if (!PASSWORD_REGEX.test(password)) {
        toast.error(MESSAGES.AUTH.ERROR.INVALID_PASSWORD_FORMAT)
        return { error: MESSAGES.AUTH.ERROR.INVALID_PASSWORD_FORMAT, isSuccess: false }
      }

      const result = await resetAction(formData)

      if (result.error) {
        toast.error(result.error)
        return { error: result.error, isSuccess: false }
      }
      toast.success(MESSAGES.AUTH.SUCCESS.PASSWORD_RESET)
      return { error: null, isSuccess: true }
    },
    { error: null, isSuccess: false }
  )
  return (
    <form action={formAction} className="space-y-6" noValidate>
      <input type="hidden" name="token" value={token} />

      <div className="space-y-2">
        <Label htmlFor="password" className="font-handwritten text-lg font-bold">
          새 비밀번호
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          className="font-handwritten text-lg rounded-xl h-12 w-full"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="font-handwritten text-lg font-bold">
          비밀번호 확인
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="font-handwritten text-lg rounded-xl h-12 w-full"
          required
        />
      </div>

      <Button
        type="submit"
        variant="basic"
        label="비밀번호 변경"
        className="w-full font-handwritten text-xl rounded-full h-12 bg-linear-to-r from-primary to-secondary hover:opacity-90"
      />
    </form>
  )
}
