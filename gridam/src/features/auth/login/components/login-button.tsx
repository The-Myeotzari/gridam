'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'

type Props = {
  setLoading: (v: boolean) => void
}

export default function SocialLoginButtons({ setLoading }: Props) {
  const supabase = createClientComponentClient()

  const handleGoogle = async () => {
    setLoading(true)

    const redirectTo = `${window.location.origin}/callback`
    console.log('google:', redirectTo)

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    })
  }

  const handleKakao = async () => {
    setLoading(true)

    const redirectTo = `${window.location.origin}/callback`
    console.log('kakao:', redirectTo)

    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo,
      },
    })
  }

  return (
    <div className="mt-6 space-y-3">
      <button
        type="button"
        onClick={handleGoogle}
        className="w-full h-12 rounded-full border border-[#F2F2F2] bg-[#F2F2F2]
             flex items-center justify-center gap-2 cursor-pointer"
      >
        <Image
          src="/icon/google.svg"
          alt="Google"
          width={40}
          height={40}
          className="object-contain"
        />

        <span className="text-sm text-[#3C4043] font-medium">Google 계정으로 계속하기</span>
      </button>

      <button
        type="button"
        onClick={handleKakao}
        className="w-full h-12 rounded-full bg-[#FFEC00]
               flex items-center justify-center gap-2 cursor-pointer"
      >
        <Image
          src="/icon/kakao.svg"
          alt="Kakao"
          width={40}
          height={40}
          className="object-contain"
        />

        <span className="text-sm text-[#3C4043] font-medium">Kakao 계정으로 계속하기</span>
      </button>
    </div>
  )
}
