'use server'

import { DEFAULT_LIMIT } from '@/app/apis/diaries/route'
import type { Diary } from '@/features/feed/feed.type'
import { MESSAGES } from '@/shared/constants/messages'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

type FetchDiaryType = {
  year: string
  month: string
  cursor: string | null
  limit?: number
}

type FetchDiaryResponseType = {
  ok: boolean
  data: {
    items: Diary[]
    nextCursor: string | null
    hasMore: boolean
  }
}

export async function fetchDiaryPage(params: FetchDiaryType): Promise<FetchDiaryResponseType> {
  const { year, month, cursor, limit = DEFAULT_LIMIT } = params

  const search = new URLSearchParams()
  const setParams = new URLSearchParams({ year, month, limit: String(limit) })
  if (cursor) search.set('cursor', String(cursor))

  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/diaries?${setParams.toString()}`,
    {
      method: 'GET',
      cache: 'no-store',
      credentials: 'include',
      next: { revalidate: 0 },
      headers: {
        Cookie: cookieHeader,
      },
    }
  )

  return res.json()
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
