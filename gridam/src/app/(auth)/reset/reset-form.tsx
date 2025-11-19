import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { resetAction } from '@/features/auth/reset/api/reset-action'

type ResetFormProps = {
  token: string
}
export default function ResetForm({ token }: ResetFormProps) {
  return (
    <form action={resetAction} className="space-y-6" noValidate>
      <input type="hidden" name="token" value={token} />

      <div className="space-y-2">
        <Label htmlFor="password" className="font-handwritten text-lg font-bold">
          새 비밀번호
        </Label>
        <Input
          id="password"
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
