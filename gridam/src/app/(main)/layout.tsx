'use client'

import Footer from '@/components/common/footer'
import Header from '@/components/common/header'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/forgot') ||
    pathname.startsWith('/reset') ||
    pathname.includes('/auth')

  return (
    <div className="min-h-dvh flex flex-col">
      {!isAuthPage && <Header />}
      <main className="container mx-auto px-4 py-8 flex-1 flex">{children}</main>
      <Footer />
    </div>
  )
}
