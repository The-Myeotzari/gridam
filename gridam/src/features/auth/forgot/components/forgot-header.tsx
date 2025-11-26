import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface AuthHeaderProps {
  title: string
  subtitle?: string
  backHref?: string
  logoSrc?: string
}

export function AuthHeader({ title, subtitle, backHref = '/login' }: AuthHeaderProps) {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 font-handwritten text-base text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          로그인으로 돌아가기
        </Link>
      </div>

      <div className="text-center">
        <div className="h-20 mx-auto mb-4 relative w-28">
          <img
            src="/favicon.ico"
            alt="그리담 GRIDAM"
            sizes="112px"
            className="object-contain"
          />
        </div>
        <h1 className="font-handwritten text-4xl text-navy-gray mb-2">{title}</h1>
        {subtitle ? (
          <p className="font-handwritten text-lg text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
    </div>
  )
}
