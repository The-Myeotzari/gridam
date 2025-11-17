import { MESSAGES } from '@/constants/messages'
import { Diary, GetDiaryParams } from '@/features/feed/types/feed'
import { getAuthenticatedUser } from '@/utils/get-authenticated-user'
import { withSignedImageUrls } from '@/utils/supabase/with-signed-image-urls'

export async function getDiaryServer({ year, month }: GetDiaryParams): Promise<Diary[]> {
  const { supabase, user } = await getAuthenticatedUser()
  if (!user) {
    throw new Error(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER)
  }
  const userId = user.id

  let query = supabase.from('diaries').select('*').eq('user_id', userId)

  if (year && month) {
    const startDate = new Date(Number(year), Number(month) - 1, 1).toISOString()
    const endDate = new Date(Number(year), Number(month), 1).toISOString()
    query = query.gte('created_at', startDate).lt('created_at', endDate)
  }

  query = query.order('created_at', { ascending: false })

  const { data: diaries, error } = await query
  if (error) throw error
  if (!diaries) return []

  const diariesTyped = diaries as Diary[]
  const diariesWithSignedUrls = await withSignedImageUrls(supabase, diariesTyped)

  return diariesWithSignedUrls
}
