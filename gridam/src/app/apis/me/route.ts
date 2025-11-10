import { fail, ok } from '@/app/apis/_lib/http'
import { MESSAGES } from '@/constants/messages'
import getSupabaseServer from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function GET(_req: NextRequest) {
  const supabase = await getSupabaseServer()

  // 1) 인증 사용자
  const { data: authData, error: authErr } = await supabase.auth.getUser()
  if (authErr || !authData?.user) {
    return fail(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER, 401)
  }
  const user = authData.user
  const userId = user.id

  // 2) 작성 일기 총 개수
  const diariesCountPromise = supabase
    .from('diaries')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  // 3) 최신 일기 3개
  const latestDiariesPromise = supabase
    .from('diaries')
    .select('id, image_url, emoji, date, content, created_at, updated_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(3)

  // 4) 게시 일자 수(distinct created_at::date)
  const postDaysCountPromise = supabase
    .from('diaries')
    .select('created_at')
    .eq('user_id', userId)
    .limit(5000) // 데이터 많으면 RPC로 대체 추천

  const [
    { count: diariesCount, error: diariesCountErr },
    { data: latestDiaries, error: latestErr },
    { data: daysCount, error: daysCountErr },
  ] = await Promise.all([diariesCountPromise, latestDiariesPromise, postDaysCountPromise])

  if (diariesCountErr) return fail(`일기 수 집계 실패: ${diariesCountErr.message}`, 500)
  if (latestErr) return fail(`최신 일기 조회 실패: ${latestErr.message}`, 500)
  if (daysCountErr) return fail(`게시 일자 수 집계 실패: ${daysCountErr.message}`, 500)

  const distinct = new Set(
    (daysCount ?? []).map((d) => new Date(d.created_at).toISOString().slice(0, 10))
  )
  const postDaysCount = distinct.size

  // 5) 응답 (Auth User만 사용, 별도 profiles 테이블 없음)
  return ok({
    user: {
      id: user.id,
      email: user.email,
      app_metadata: user.app_metadata ?? {},
      user_metadata: user.user_metadata ?? {},
    },
    stats: {
      diariesCount: diariesCount ?? 0,
      postDaysCount: postDaysCount ?? 0,
    },
    latestDiaries: latestDiaries ?? [],
  })
}
