'use client'

import Button from '@/components/ui/button'
import { modalStore } from '@/store/modal-store'
import { Key, LogOut } from 'lucide-react'
import ChangePasswordModal from './change-password-modal'

export default function MyPageActions() {
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
    </section>
  )
}