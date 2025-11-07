'use client'

import Image from 'next/image'
import Link from 'next/link'
import NavLink from '@/components/common/navlink'

export default function Header() {
  const userName = '별빛나눔' // 로그인 후 실제 사용자 이름으로 교체

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border paper-texture">
      <div className="max-w-screen-xl mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-3 hover-float">
          <Image
            src="/favicon.ico"
            alt="그리담 GRIDAM"
            width={48}
            height={48}
            className="shrink-0"
          />
          <span className="text-2xl font-bold text-foreground">그리담 GRIDAM</span>
        </Link>

        {/* 네비게이션 */}
        <nav className="flex items-center gap-6">
          <NavLink href="/feed" label="피드" activeColor="primary" />
          <NavLink href="/mypage" label="마이페이지" activeColor="accent" />
          <span className="text-lg text-primary">{userName}</span>
        </nav>
      </div>
    </header>
  )
}
