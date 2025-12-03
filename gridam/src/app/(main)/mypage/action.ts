import { MESSAGES } from '@/shared/constants/messages'
import { getCookies } from '@/shared/utils/get-cookies'

// 사용자 통합 정보 조회 함수
export async function getUserData() {
  const cookieHeader = await getCookies()

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/mypage`, {
    method: 'GET',
    cache: 'no-store',
    credentials: 'include',
    next: { revalidate: 0 },
    headers: {
      Cookie: cookieHeader,
    },
  })

  return res.json()
}

export async function getMonthlyDiaries(params: {
  year: string
  month: string // 1 ~ 12
}) {
  const { year, month } = params

  const setParams = new URLSearchParams({ year, month })

  const cookieHeader = await getCookies()

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/diaries/monthly?${setParams.toString()}`,
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
  const json = await res.json()

  if(!json.ok){
    throw new Error(json.message ?? MESSAGES.DIARY.ERROR.READ)
  }

  return json.data
}
