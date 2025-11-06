'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  const userName = '별빛나눔' // TODO: 로그인 후 실제 사용자 이름으로 교체

  const isActive = (path: string) => pathname === path

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
          {/* 피드 */}
          <Link
            href="/feed"
            className={`text-lg px-4 py-2 rounded-full transition-all ${
              isActive('/feed')
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-primary/10 text-foreground'
            }`}
          >
            피드
          </Link>

          {/* 마이페이지 */}
          <Link
            href="/mypage"
            className={`text-lg px-4 py-2 rounded-full transition-all ${
              isActive('/mypage')
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-accent/50 text-foreground'
            }`}
          >
            마이페이지
          </Link>

          {/* 닉네임 */}
          <span className="text-lg text-primary">{userName}</span>
        </nav>
      </div>
    </header>
  )
}
