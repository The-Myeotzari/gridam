'use client'

import { useLogout } from '@/features/mypage/api/queries/use-logout'
import DropBox from '@/shared/ui/dropbox'
import { useRouter } from 'next/navigation'

interface HeaderUserMenuProps {
  userName: string
}

export default function HeaderUserMenu({ userName }: HeaderUserMenuProps) {
  const router = useRouter()
  const { mutate: handleLogout } = useLogout()

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
          { key: 'draft', label: '임시 글', onSelect: () => router.push('/draft') },
          {
            key: 'logout',
            label: '로그아웃',
            tone: 'destructive',
            onSelect: () => handleLogout(),
          },
        ]}
      />
    </div>
  )
}
