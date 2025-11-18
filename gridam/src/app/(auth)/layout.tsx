import Footer from '@/components/common/footer'
import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {

  return (
    <div className="min-h-dvh flex flex-col">
      <main className="container mx-auto px-4 py-8 flex-1 flex">{children}</main>
      <Footer />
    </div>
  )
}
