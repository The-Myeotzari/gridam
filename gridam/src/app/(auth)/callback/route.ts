import { URL_CONSTANTS } from '@/shared/constants/url.constants'
import getSupabaseServer, { getOrigin } from '@/shared/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  const supabase = await getSupabaseServer()

  const envOrigin = await getOrigin()
  const origin = envOrigin ?? requestUrl.origin

  // code 없으면: 세션 있으면 홈, 없으면 로그인
  if (!code) {
    const { data } = await supabase.auth.getUser()

    if (data.user) {
      return NextResponse.redirect(new URL(URL_CONSTANTS.HOME, origin))
    }

    return NextResponse.redirect(new URL(URL_CONSTANTS.AUTH.LOGIN, origin))
  }

  // OAuth code -> 세션 교환
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('exchangeCodeForSession error', error)
    return NextResponse.redirect(new URL(URL_CONSTANTS.AUTH.LOGIN, origin))
  }

  return NextResponse.redirect(new URL(URL_CONSTANTS.HOME, origin))
}
