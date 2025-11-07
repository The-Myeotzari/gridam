import Footer from '@/components/common/footer'
import Header from '@/components/common/header'
import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">{children}</main>
      <Footer />
    </>
  )
}
