'use server'

import type { Diary } from '@/features/feed/feed.type'
import type { Memo } from '@/features/memo/api/memo.action'
import { getCookies } from '@/shared/utils/get-cookies'

type FetchCalendarParams = {
  year?: number
  month?: number
  day?: number
}

export type CalendarResponse = {
  ok: boolean
  data: {
    diary: Diary[] | null
    memos: Memo[]
  }
}

export async function fetchCalendar(params: FetchCalendarParams = {}): Promise<CalendarResponse> {
  // 기본값은 오늘 날짜
  const today = new Date()

  const year = params.year ?? today.getFullYear()
  const month = params.month ?? today.getMonth() + 1
  const day = params.day ?? today.getDate()

  const cookieHeader = await getCookies()

  const searchParams = new URLSearchParams({
    year: String(year),
    month: String(month),
    day: String(day),
  })

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/calendar?${searchParams.toString()}`,
    {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      next: { revalidate: 0 },
      headers: {
        Cookie: cookieHeader,
      },
    }
  )

  return res.json()
}
