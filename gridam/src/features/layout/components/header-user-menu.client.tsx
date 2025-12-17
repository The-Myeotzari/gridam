'use client'

import { URL_CONSTANTS } from '@/shared/constants/url.constants'
import { useLogout } from '@/shared/hooks/use-logout'
import DropBox from '@/shared/ui/dropbox'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

interface HeaderUserMenuClientProps {
  userName: string
  avatar: ReactNode
}
export default function HeaderUserMenuClinet({ userName, avatar }: HeaderUserMenuClientProps) {
  const router = useRouter()
  const { logout } = useLogout()

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <DropBox
        id="header-user-menu"
        trigger={
          <button className="flex gap-2 items-center text-xs sm:text-sm md:text-base text-primary cursor-pointer">
            <span className="hidden sm:block text-black">{userName}</span>
            {avatar}
          </button>
        }
        // TODO 상수화 처리 필요 - 추후 API 및 페이지 경로 전체 상수화 진행 필요
        items={[
          {
            key: 'mypage',
            label: '마이페이지',
            onSelect: () => router.push(URL_CONSTANTS.MYPAGE.BASE),
          },
          { key: 'draft', label: '보관함', onSelect: () => router.push(URL_CONSTANTS.DRAFT) },
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
