import { URL_CONSTANTS } from '@/shared/constants/url.constants'
import { NextRequest, NextResponse } from 'next/server'
import getSupabaseServer from '@/shared/utils/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  const supabase = await getSupabaseServer()

  // code 없으면: 세션 있으면 홈, 없으면 로그인
  if (!code) {
    const { data } = await supabase.auth.getUser()

    if (data.user) {
      return NextResponse.redirect(new URL(URL_CONSTANTS.HOME, request.url))
    }

    return NextResponse.redirect(new URL(URL_CONSTANTS.AUTH.LOGIN, request.url))
  }

  // OAuth code -> 세션 교환
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('exchangeCodeForSession error', error)
    return NextResponse.redirect(new URL(URL_CONSTANTS.AUTH.LOGIN, request.url))
  }

  return NextResponse.redirect(new URL(URL_CONSTANTS.HOME, request.url))
}
