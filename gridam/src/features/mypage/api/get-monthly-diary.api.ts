import { Diary } from '@/features/mypage/types/mypage'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { withSignedImageUrls } from '@/shared/utils/with-signed-image-urls'

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

  const { supabase, user } = await getAuthenticatedUser()

  if (!user) {
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
    throw new Error('DB_ERROR')
  }

  const diaries: Diary[] = data ?? []

  const diariesWithImages: Diary[] = await withSignedImageUrls<Diary>(supabase, diaries)
  
  return {
    year,
    month,
    diaries: diariesWithImages,
  }
}
