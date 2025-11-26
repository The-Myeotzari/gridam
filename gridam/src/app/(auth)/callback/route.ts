import { NextRequest, NextResponse } from 'next/server'
import getSupabaseServer from '@/shared/utils/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  // code 없으면 로그인으로
  if (!code) {
    return NextResponse.redirect(new URL('/login', requestUrl))
  }

  const supabase = await getSupabaseServer()

  // OAuth code -> 세션 교환
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('exchangeCodeForSession error', error)
    // 세션 교환 실패 -> 로그인으로
    return NextResponse.redirect(new URL('/login', requestUrl))
  }

  return NextResponse.redirect(new URL('/', requestUrl))
}
