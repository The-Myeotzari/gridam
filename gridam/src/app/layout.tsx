import '@/app/globals.css'
import QueryProvider from '@/providers/query-providers'
import ModalRoot from '@/shared/ui/modal/modal-root.client'
import Toast from '@/shared/ui/toast'
import type { Metadata } from 'next'
import localFont from 'next/font/local'

const zenSerif = localFont({
  src: '../shared/font/ZEN-SERIF-TTF-Regular.woff2',
  variable: '--font-zen-serif',
})

export const metadata: Metadata = {
  title: 'Gridam',
  description: '그리담 홈페이지',
  keywords: ['그리담', 'Gridam', '그림일기'],  
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <QueryProvider>
        <body className={`${zenSerif.variable} font-pretendard`}>
          {children}
          <Toast />
          <ModalRoot />
        </body>
      </QueryProvider>
    </html>
  )
}
