import { fail, ok } from '@/app/apis/_lib/http'
import { MESSAGES } from '@/constants/messages'
import getSupabaseServer from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const path = searchParams.get('path')
    if (!path) return fail('path 파라미터가 필요합니다.', 400)

    const supabase = await getSupabaseServer()
    const { data: user } = await supabase.auth.getUser()
    if (!user?.user) return fail(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER, 401)

    // path 검증 (own-folder)
    const userId = user.user.id
    if (!path.startsWith(`${userId}/`)) return fail('own-folder 정책 위반', 403)

    const { data, error } = await supabase.storage
      .from('diary-images')
      .createSignedUrl(path, 60 * 5) // TTL: 5분

    if (error) throw error
    return ok({ signedUrl: data.signedUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : '이미지 불러오기에 실패하였습니다.'
    return fail(message, 500)
  }
}
