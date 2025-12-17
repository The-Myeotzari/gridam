'use server'

import { DEFAULT_LIMIT } from '@/app/apis/diaries/route'
import { deleteImageAction } from '@/features/diary/apis/image.action'
import type { Diary } from '@/features/feed/feed.type'
import { API_ENDPOINTS } from '@/shared/constants/api.endpoints'
import { MESSAGES } from '@/shared/constants/messages'
import { api } from '@/shared/lib/fetch-api'
import { getCookies } from '@/shared/utils/get-cookies'

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
    // TODO: 개발 완료 이후 상수화 필요
    todayDiaryStatus: 'published' | 'draft' | 'none'
  }
}

export async function fetchDiaryPage(params: FetchDiaryType): Promise<FetchDiaryResponseType> {
  const { year, month, cursor, limit = DEFAULT_LIMIT } = params

  const setParams = new URLSearchParams({ year, month, limit: String(limit) })
  if (cursor) setParams.set('cursor', String(cursor))

  const cookieHeader = await getCookies()

  const res = await api(`${API_ENDPOINTS.DIARIES.BASE}?${setParams.toString()}`, {
    cookieHeader,
  })

  return res.json()
}

export async function deleteDiary(id: string, imagePath?: string | null) {
  if (!id) throw new Error(MESSAGES.DIARY.ERROR.READ)
  const cookieHeader = await getCookies()

  if (imagePath) {
    try {
      await deleteImageAction({ imagePath, cookieHeader })
    } catch (e) {
      console.warn('게시글 삭제 전 이미지 삭제 실패', e)
    }
  }

  const res = await api(`${API_ENDPOINTS.DIARIES.BY_ID(id)}`, {
    method: 'DELETE',
    cookieHeader,
  })

  return res.json()
}
