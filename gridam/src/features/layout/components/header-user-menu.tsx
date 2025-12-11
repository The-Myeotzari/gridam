'use client'

import { useLogout } from '@/shared/hooks/use-logout'
import DropBox from '@/shared/ui/dropbox'
import { UserAvatar } from '@/shared/ui/user-avatar'
import { useRouter } from 'next/navigation'

interface HeaderUserMenuProps {
  userName: string
}

export default function HeaderUserMenu({ userName }: HeaderUserMenuProps) {
  const router = useRouter()
  const { logout } = useLogout()

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <DropBox
        id="header-user-menu"
        trigger={
          <button className="flex gap-2 items-center text-xs sm:text-sm md:text-base text-primary cursor-pointer">
            <span className="text-black">{userName}</span>
            <UserAvatar size={35} />
          </button>
        }
        // TODO 상수화 처리 필요 - 추후 API 및 페이지 경로 전체 상수화 진행 필요
        items={[
          { key: 'mypage', label: '마이페이지', onSelect: () => router.push('/mypage') },
          { key: 'draft', label: '보관함', onSelect: () => router.push('/draft') },
          {
            key: 'logout',
            label: '로그아웃',
            tone: 'destructive',
            onSelect: () => logout(),
          },
        ]}
      />
    </div>
  )
}
