import { Diary, GetDiaryParams } from '@/features/feed/types/feed'
import getSupabaseServer from '@/utils/supabase/server'

export async function getDiaryServer({ year, month }: GetDiaryParams): Promise<Diary[]> {
  const supabase = await getSupabaseServer()
  const { data: user } = await supabase.auth.getUser()
  if (!user?.user) {
    throw new Error('UNAUTHORIZED_USER')
  }
  const userId = user.user.id

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

  const TTL = 60 * 5
  const withSignedImages: Diary[] = []

  for (const diary of diaries as Diary[]) {
    if (diary.image_url && diary.image_url.startsWith(`${userId}/`)) {
      const { data: signed, error: signedError } = await supabase.storage
        .from('diary-images')
        .createSignedUrl(diary.image_url, TTL)

      withSignedImages.push({
        ...diary,
        image_url: signedError ? null : signed.signedUrl,
      })
    } else {
      withSignedImages.push({ ...diary, image_url: null })
    }
  }

  return withSignedImages
}
