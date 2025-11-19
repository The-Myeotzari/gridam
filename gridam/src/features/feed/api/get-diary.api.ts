import type { DiaryPage } from '@/features/feed/types/feed'
import { MESSAGES } from '@/shared/constants/messages'

interface Params {
  year: string
  month: string
  cursor?: string | null
}

export async function getDiary({ year, month, cursor }: Params): Promise<DiaryPage> {
  const params = new URLSearchParams({ year, month })
  if (cursor) params.set('cursor', cursor)

  const res = await fetch(`/apis/diaries?${params.toString()}`)

  if (!res.ok) {
    throw new Error(MESSAGES.DIARY.ERROR.READ)
  }

  return res.json()
}
