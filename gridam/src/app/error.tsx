'use client'
import ClientButton from '@/shared/ui/client-button'
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ErrorPropsType {
  title?: string
  message?: string
}

const ErrorProps: ErrorPropsType = {
  title: '문제가 발생했어요.',
  message: '예상치 못한 오류가 발생했습니다. 잠시 후 시도해주세요.',
}

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 space-y-6">
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-destructive/10 flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-12 h-12 md:w-16 md:h-16 text-destructive" />
          </div>
          <div className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 rounded-full bg-destructive/5 blur-xl" />
        </div>
      </div>
      {/* 2 */}
      <div className="flex flex-col items-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground">{ErrorProps.title}</h2>
        <p className="text-muted-foreground max-w-md mx-auto text-center">{ErrorProps.message}</p>
      </div>
      {/* 3 */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20">
        <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
        <span className="text-sm font-medium text-destructive ">Error 500</span>
      </div>
      {/* 4 */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <ClientButton
          label={
            <div className="flex gap-2 items-center">
              <RefreshCcw className="h-4 w-4" />
              <span className="font-bold">다시 시도하기</span>
            </div>
          }
          onClick={() => {
            reset()
          }}
          isActive={true}
          variant="blue"
          className="lg: h-11 rounded-md px-8 hover:cursor-pointer"
        />
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
          variant="basic"
          className="lg: h-11 rounded-md px-8 hover:cursor-pointer "
        />
      </div>
      <p className="text-xs text-muted-foreground pt-4">
        문제가 계속되면 관리자에게 문의해 주세요.
      </p>
    </div>
  )
}
