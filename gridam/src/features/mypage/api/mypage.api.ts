import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'

// 사용자 통합 정보 조회 함수
export async function getUserData() {
  const { supabase, user } = await getAuthenticatedUser()

  const userId = user.id

  // 여기서부터는 supabase.from(...) 으로 통계/일기 조회
  const { data: diaries, error } = await supabase
    .from('diaries')
    .select('id, image_url, emoji, date, content, created_at')
    .eq('user_id', userId)
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .is('deleted_at', null)
    .order('date', { ascending: false })

  if (error || !diaries) {
    return { ok: false, message: `일기 집계에 실패했습니다` }
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

  return {
    ok: true,
    data: {
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
    },
  }
}
