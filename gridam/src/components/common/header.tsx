'use client'

import HeaderNavLink from '@/components/common/header-navlink'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  const userName = '별빛나눔' // 로그인 후 실제 사용자 이름으로 교체

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border paper-texture">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-14 sm:h-16 md:h-20 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 hover-float">
          <Image
            src="/favicon.ico"
            alt="그리담 GRIDAM"
            width={48}
            height={48}
            className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
          />
          <span className="text-base sm:text-xl md:text-2xl font-bold text-foreground">
            그리담 GRIDAM
          </span>
        </Link>

        {/* 네비게이션 */}
        <nav className="flex items-center gap-2 sm:gap-4 md:gap-6">
          <HeaderNavLink href="/feed" label="피드" activeColor="primary" />
          <HeaderNavLink href="/mypage" label="마이페이지" activeColor="accent" />
          <span className="text-xs sm:text-sm md:text-base text-primary">{userName}</span>
        </nav>
      </div>
    </header>
  )
}
