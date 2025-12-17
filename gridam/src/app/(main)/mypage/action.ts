import { API_ENDPOINTS } from '@/shared/constants/api.endpoints'
import { MESSAGES } from '@/shared/constants/messages'
import { api } from '@/shared/lib/fetch-api'
import { getCookies } from '@/shared/utils/get-cookies'

// 사용자 통합 정보 조회 함수
export async function getUserData() {
  const cookieHeader = await getCookies()

  const res = await api(`${API_ENDPOINTS.MYPAGE.BASE}`, {
    cookieHeader,
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

  const res = await api(`${API_ENDPOINTS.DIARIES.MONTHLY}?${setParams.toString()}`, {
    cookieHeader,
  })

  const json = await res.json()

  if (!json.ok) {
    throw new Error(json.message ?? MESSAGES.DIARY.ERROR.READ)
  }

  return json.data
}
