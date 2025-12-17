import { URL_CONSTANTS } from '@/shared/constants/url.constants'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface AuthHeaderProps {
  title: string
  subtitle?: string
  backHref?: string
  logoSrc?: string
}

export function AuthHeader({
  title,
  subtitle,
  backHref = URL_CONSTANTS.AUTH.LOGIN,
}: AuthHeaderProps) {
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
          <Image
            src="/image/logo.png"
            width={56}
            height={56}
            alt="그리담로고"
            className=" mx-auto"
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
