import getSupabaseServer from '@/utils/supabase/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'
  if (token_hash && type) {
    const supabase = await getSupabaseServer()
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // 지정된 URL로 사용자 리다이렉트 (로그인 페이지)
      redirect(next)
    }
  }
  // 메인 페이지로 사용자 리다이렉트
  redirect('/')
}
