import { fail, ok } from '@/app/apis/_lib/http'
import { MESSAGES } from '@/shared/constants/messages'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { NextRequest } from 'next/server'

export async function GET(_req: NextRequest) {
  const { supabase, user } = await getAuthenticatedUser()

  const userId = user.id

  // 여기서부터는 supabase.from(...) 으로 통계/일기 조회
  // 작성 일자 (created_at) 기준
  const { data: diaries, error } = await supabase
    .from('diaries')
    .select('id, image_url, emoji, date, content, created_at')
    .eq('user_id', userId)
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error || !diaries) {
    return fail(MESSAGES.DIARY.ERROR.READ, 400)
  }

  const totalDiaries = diaries.length ?? 0

  const daySet = new Set<string>()
  diaries.forEach((diary) => {
    const date = new Date(diary.created_at).toISOString().slice(0, 10)
    daySet.add(date)
  })

  const recent = (diaries ?? []).slice(0, 3).map((diary) => {
    const dateObj = new Date(diary.created_at)
    const date = dateObj.toISOString().slice(0, 10)
    const time = dateObj.toTimeString().slice(0, 5)
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()]

    return {
      id: diary.id,
      date,
      time,
      weekday: `${weekday}요일`,
      content: diary.content,
      emoji: diary.emoji ?? '',
    }
  })

  return ok({
      user: {
        id: user.id,
        email: user.email ?? '',
        nickname: user.user_metadata.nickname ?? user.user_metadata.name ?? '',
        created_at: new Date(user.created_at).toISOString().slice(0, 10),
      },
      stats: {
        totalDiaries,
        totalDays: daySet.size,
      },
      recentDiaries: recent,
    }, 200)
}
