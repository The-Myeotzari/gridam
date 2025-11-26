import { NextRequest, NextResponse } from 'next/server'
import getSupabaseServer from '@/shared/utils/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  // 1. 항상 ENV 기준 origin 우선 사용
  const envOrigin = process.env.NEXT_PUBLIC_BASE_URL
  const origin = envOrigin ?? requestUrl.origin

  // code 없으면 로그인으로
  if (!code) {
    return NextResponse.redirect(new URL('/login', origin))
  }

  const supabase = await getSupabaseServer()

  // OAuth code -> 세션 교환
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('exchangeCodeForSession error', error)
    // 세션 교환 실패 -> 로그인으로
    return NextResponse.redirect(new URL('/login', origin))
  }

  return NextResponse.redirect(new URL('/', origin))
}
