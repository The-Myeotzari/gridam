'use client'

import ChangePasswordModal from '@/features/mypage/components/change-password/change-password-modal'
import { useLogout } from '@/shared/hooks/use-logout'
import ClientButton from '@/shared/ui/client-button'
import { modalStore } from '@/store/modal-store'
import { Key, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function MyPageButtons() {
  const router = useRouter()
  const { logout, isLoading } = useLogout()

  return (
    <section className="flex gap-2">
      <ClientButton
        label={
          <>
            <Key />
            비밀번호 변경
          </>
        }
        className="flex-1"
        variant="roundedBasic"
        onClick={() => modalStore.open((close) => <ChangePasswordModal close={close} />)}
      />
      <ClientButton
        type="button"
        label={
          <>
            <LogOut />
            로그아웃
          </>
        }
        className={`flex-1 ${isLoading && 'pointer-events-none opacity-50'}`}
        variant="roundedRed"
        onClick={() => logout()}
      />
    </section>
  )
}
