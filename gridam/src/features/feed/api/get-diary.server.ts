import { MESSAGES } from '@/constants/messages'
import type { DiaryPage, GetDiaryParams } from '@/features/feed/types/feed'
import { getAuthenticatedUser } from '@/utils/get-authenticated-user'
import { withSignedImageUrls } from '@/utils/supabase/with-signed-image-urls'

const DEFAULT_LIMIT = 5

export async function getDiaryServer({ year, month, cursor }: GetDiaryParams): Promise<DiaryPage> {
  const { supabase, user } = await getAuthenticatedUser()

  if (!user) throw new Error(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER)

  let query = supabase
    .from('diaries')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (year && month) {
    const start = new Date(Number(year), Number(month) - 1, 1).toISOString()
    const end = new Date(Number(year), Number(month), 1).toISOString()
    query = query.gte('published_at', start).lt('published_at', end)
  }

  if (cursor) {
    query = query.lt('published_at', cursor)
  }

  query = query.order('published_at', { ascending: false }).limit(DEFAULT_LIMIT + 1)

  const { data, error } = await query
  if (error) throw MESSAGES.DIARY.ERROR.READ

  if (!data || data.length === 0) {
    return { items: [], nextCursor: null, hasMore: false }
  }

  const hasMore = data.length > DEFAULT_LIMIT
  const items = hasMore ? data.slice(0, DEFAULT_LIMIT) : data

  const diariesWithSignedUrls = await withSignedImageUrls(supabase, items)
  const lastItem = items[items.length - 1]

  return {
    items: diariesWithSignedUrls,
    nextCursor: hasMore ? lastItem.published_at : null,
    hasMore,
  }
}
