import { QUERY_KEYS } from '@/constants/query-key'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { Diary } from '../types/feed'
import { getDiary } from './get-diary.api'

type UseGetDiaryParams = {
  year: string
  month: string
  initialDiaries: Diary[]
}

export function useGetDiary({ year, month, initialDiaries }: UseGetDiaryParams) {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.DIARY.LIST(year, month),
    queryFn: ({ pageParam }) => getDiary({ year, month, cursor: pageParam ?? null }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: {
      pages: [
        {
          items: initialDiaries,
          nextCursor: null,
          hasMore: true,
        },
      ],
      pageParams: [undefined] as (string | undefined)[],
    },
  })
}
