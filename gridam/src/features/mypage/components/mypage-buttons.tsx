'use client'

import Button from '@/components/ui/button'
import { modalStore } from '@/store/modal-store'
import { Key, LogOut } from 'lucide-react'
import ChangePasswordModal from '@/features/mypage/components/change-password-modal'
import { useRouter } from 'next/navigation'
import { useLogout } from '../api/queries/use-logout'
import { toast } from '@/store/toast-store'
import { MESSAGES } from '@/constants/messages'
import { AxiosError } from 'axios'

export default function MyPageButtons() {
  const router = useRouter()
  const { mutate, isPending } = useLogout()

  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        toast.success(MESSAGES.AUTH.SUCCESS.LOGOUT)
        router.push('/login')
        router.refresh()
      },
      onError: (err) => {
        const message = err instanceof AxiosError ? err.response?.data.message : MESSAGES.AUTH.ERROR.LOGOUT
        toast.error(message)
      },
    })
  }

  return (
    <section className="flex gap-2">
      <span onClick={() => modalStore.open((close) => <ChangePasswordModal close={close} />)}>
        <Button
          label={
            <>
              <Key />
              비밀번호 변경
            </>
          }
          className="flex-1"
          variant="roundedBasic"
        />
      </span>
      <span onClick={handleLogout} className={isPending ? "pointer-events-none opacity-50" : ""}>
        <Button
          type='button'
          label={
            <>
              <LogOut />
              로그아웃
            </>
          }
          className="flex-1"
          variant="roundedRed"
        />
      </span>
    </section>
  )
}