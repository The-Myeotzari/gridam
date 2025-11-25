'use client'

import { useLogout } from '@/features/mypage/api/queries/use-logout'
import ChangePasswordModal from '@/features/mypage/components/change-password-modal'
import Button from '@/shared/ui/button'
import { modalStore } from '@/store/modal-store'
import { Key, LogOut } from 'lucide-react'

export default function MyPageButtons() {
  const { mutate: handleLogout, isPending } = useLogout()

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
      <span onClick={() => handleLogout()} className={isPending ? 'pointer-events-none opacity-50' : ''}>
        <Button
          type="button"
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
