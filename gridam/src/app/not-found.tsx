// NOTE: 디자인 보완 필요
'use client'
import ClientButton from '@/shared/ui/client-button'
import { ArrowLeft, Home } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()
  const pathName = usePathname()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 space-y-6">
      <div className="text-center space-y-6">
        <div className="relative">
          <h1 className="text-[150px] md:text-[200px] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/60 to-primary/20">
            404
          </h1>
          <div className="absolute inset-0 text-[150px] md:text-[200px] font-bold leading-none text-primary/5 blur-2xl">
            404
          </div>
        </div>
      </div>
      {/* 2 */}
      <div className="flex flex-col items-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
          페이지를 찾을 수 없어요.
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto text-center">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있어요.
          <br />
          주소를 다시 확인해 주세요.
        </p>
        <div className="border px-4 py-2 rounded-lg bg-muted/50 text-sm text-muted-foreground">
          {pathName}
        </div>
      </div>
      {/* 3 */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <ClientButton
          label={
            <div className="flex gap-2 items-center">
              <Home className="h-4 w-4" />
              <span className="font-bold">홈으로 돌아가기</span>
            </div>
          }
          onClick={() => {
            router.push('/')
          }}
          isActive={true}
          variant="blue"
          className="lg: h-11 rounded-md px-8 hover:cursor-pointer"
        />

        <ClientButton
          label={
            <div className="flex gap-2 items-center">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-bold">이전 페이지</span>
            </div>
          }
          onClick={() => {
            router.back()
          }}
          variant="basic"
          className="lg: h-11 rounded-md px-8 hover:cursor-pointer"
        />
      </div>
    </div>
  )
}
