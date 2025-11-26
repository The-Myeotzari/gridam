import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    // code 없으면 로그인으로
    return NextResponse.redirect(new URL('/login', requestUrl))
  }

  let response = NextResponse.redirect(new URL('/', requestUrl))

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // 요청에서 쿠키 읽기
        getAll() {
          return request.cookies.getAll()
        },
        // Supabase가 Set-Cookie 하려고 할 때 여기로 들어옴
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    // 세션 교환 실패 -> 로그인으로
    return NextResponse.redirect(new URL('/login', requestUrl))
  }

  return response
}
