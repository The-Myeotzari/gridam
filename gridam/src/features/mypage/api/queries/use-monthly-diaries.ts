'use client'

import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/constants/query-key'
import { MonthlyDiaries } from '@/features/mypage/types/mypage'

type UseMonthlyDiariesOptions = {
  initialData?: MonthlyDiaries
}

export function useMonthlyDiaries(year: number, month: number, options?: UseMonthlyDiariesOptions) {
  return useQuery<unknown, Error, MonthlyDiaries>({
    queryKey: QUERY_KEYS.DIARY.MONTHLY_EXPORT(year, month),
    queryFn: async () => {
      const setParams = new URLSearchParams({ year: year.toString(), month: month.toString() })
      const res = await fetch(`/apis/diaries/monthly?${setParams.toString()}`, { method: 'GET' })
      const json = await res.json()
      return json.data
    },
    // 초기 마이페이지 렌더링 때 서버에서 가져온 값이 있으면 그대로 재사용
    initialData: options?.initialData,
    // 한 번 가져온 월은 5분 동안은 “신선한 데이터”로 취급 (불필요한 재요청 방지)
    staleTime: 5 * 60 * 1000,
    // 포커스로 돌아와도 자동 재요청 안 하도록 (부하 감소)
    refetchOnWindowFocus: false,
  })
}
