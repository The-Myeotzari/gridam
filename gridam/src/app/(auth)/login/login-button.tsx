'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'

export default function SocialLoginButtons() {
  const supabase = createClientComponentClient()

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    })
  }

  const handleKakao = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    })
  }

  return (
    <div className="mt-6 space-y-3">
      <button
        type="button"
        onClick={handleGoogle}
        className="w-full h-12 rounded-full border border-[#F2F2F2] bg-[#F2F2F2]
               flex items-center justify-center gap-3"
      >
        <div className="relative" style={{ width: 190, height: 40 }}>
          <Image
            src="/image/google-login.png"
            alt="Google"
            fill
            className="object-contain"
            sizes="190px"
          />
        </div>
      </button>

      <button
        type="button"
        onClick={handleKakao}
        className="w-full h-12 rounded-full bg-[#FEE500]
               flex items-center justify-center px-4"
      >
        <div className="relative" style={{ width: 190, height: 48 }}>
          <Image
            src="/image/kakao-login.png"
            alt="Login with Kakao"
            fill
            className="object-contain"
            sizes="190px"
          />
        </div>
      </button>
    </div>
  )
}
