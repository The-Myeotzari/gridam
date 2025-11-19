import { Diary } from '@/features/feed/types/feed'
import getSupabaseServer from '@/shared/utils/supabase/server'

export async function getMonthlyDiaries({
  year,
  month,
}: {
  year: number
  month: number // 1 ~ 12
}) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error('INVALID_YEAR_MONTH')
  }

  const supabase = await getSupabaseServer()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('UNAUTHORIZED')
  }

  const fromDate = new Date(year, month - 1, 1)
  const toDate = new Date(year, month, 1)

  const from = fromDate.toISOString().slice(0, 10) // 'YYYY-MM-DD'
  const to = toDate.toISOString().slice(0, 10)

  // published만 포함 (draft 제외)
  const { data, error } = await supabase
    .from('diaries')
    .select(`*`)
    .eq('user_id', user.id)
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .is('deleted_at', null)
    .gte('created_at', from)
    .lt('created_at', to)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[getMonthlyDiaries] supabase error', error)
    throw new Error('DB_ERROR')
  }

  const diaries: Diary[] = data ?? []

  // TODO: image_url 사용해 이미지 가져오기
  return {
    year,
    month,
    diaries,
  }
}
