'use server'

import type { Diary } from '@/features/feed/feed.type'
import { MESSAGES } from '@/shared/constants/messages'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { withSignedImageUrls } from '@/shared/utils/supabase/with-signed-image-urls'
import { revalidatePath } from 'next/cache'

const DEFAULT_LIMIT = 5

export type DiaryPage = {
  items: Diary[]
  nextCursor: string | null
  hasMore: boolean
}

export async function fetchDiaryPage(params: {
  year: string
  month: string
  cursor: string | null
  limit?: number
}): Promise<DiaryPage> {
  const { year, month, cursor, limit = 10 } = params
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

export async function deleteDiary(id: string) {
  const { supabase, user } = await getAuthenticatedUser()
  if (!user) throw new Error(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER)

  const { data: existing, error: fetchErr } = await supabase
    .from('diaries')
    .select('id, user_id, deleted_at')
    .eq('id', id)
    .single()

  if (fetchErr) throw MESSAGES.DIARY.ERROR.READ
  if (!existing) throw MESSAGES.DIARY.ERROR.READ_NO
  if (existing.deleted_at) throw MESSAGES.DIARY.ERROR.DELETE_OVER

  const { error } = await supabase
    .from('diaries')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw MESSAGES.DIARY.ERROR.DELETE

  revalidatePath('/')
  return { ok: true }
}
