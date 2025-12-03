'use server'

import { MonthlyData } from '@/features/calendar/components/calendar-client'
import type { Diary } from '@/features/feed/feed.type'
import type { Memo } from '@/features/memo/api/memo.action'
import { getDateParts } from '@/shared/utils/date'
import { getCookies } from '@/shared/utils/get-cookies'

type FetchCalendarParams = {
  year?: number
  month?: number
  day?: number
}

type fetchCalendarMonthParams = {
  year?: number
  month?: number
}

export type CalendarResponse = {
  ok: boolean
  data: {
    diary?: Diary | null
    memos?: Memo[]
    monthlyData?: MonthlyData
  }
}

export async function fetchCalendar(params: FetchCalendarParams = {}): Promise<CalendarResponse> {
  // 기본값은 오늘 날짜
  const { year, month, day } = getDateParts()

  const cookieHeader = await getCookies()

  const searchParams = new URLSearchParams({
    year: String(year),
    month: String(month),
    day: String(day),
  })

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/calendar/day?${searchParams.toString()}`,
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

//특정 달 monthlyData (일기, 메모를 표시하기 위함.)
export async function fetchCalendarMonth(params: fetchCalendarMonthParams = {}) {
  const today = new Date()

  const year = params.year ?? today.getFullYear()
  const month = params.month ?? today.getMonth() + 1

  const cookieHeader = await getCookies()

  const searchParams = new URLSearchParams({
    year: String(year),
    month: String(month),
  })

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/calendar/month?${searchParams.toString()}`,
    {
      method: 'GET',
      credentials: 'include',
      cache: 'no-cache',
      next: { revalidate: 0 },
      headers: { Cookie: cookieHeader },
    }
  )
  return res.json()
}
