'use client'

import DropBox from '@/components/ui/dropbox'
import { useModalStore } from '@/store/modal-store'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { HeaderDraftModal } from './header-draft-modal'

export default function HeaderUserMenu() {
  const router = useRouter()
  const modalStore = useModalStore()
  const userName = '닉네임'

  const openDraftModal = useCallback(() => {
    modalStore.open((close) => <HeaderDraftModal onClose={close} />)
  }, [modalStore])

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <DropBox
        id="header-user-menu"
        trigger={
          <button className="text-xs sm:text-sm md:text-base text-primary">{userName}</button>
        }
        // TODO 상수화 처리 필요 - 추후 API 및 페이지 경로 전체 상수화 진행 필요
        items={[
          { key: 'mypage', label: '마이페이지', onSelect: () => router.push('/mypage') },
          { key: 'draft', label: '임시 글', onSelect: openDraftModal },
          {
            key: 'logout',
            label: '로그아웃',
            tone: 'destructive',
            onSelect: () => router.push('/logout'),
          },
        ]}
      />
    </div>
  )
}
