'use client'

import { QUERY_KEYS } from '@/constants/query-key'
import { resolveYearMonth } from '@/features/feed/utils/diary-date'
import { postDiary } from '@/features/write/api/post-diary.api'
import type { CreateDiaryPayload } from '@/features/write/types/diary'
import { toast } from '@/store/toast-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'

export function usePostDiary() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  const params = {
    year: searchParams.get('year') ?? undefined,
    month: searchParams.get('month') ?? undefined,
  }

  const { year, month } = resolveYearMonth(params)

  return useMutation({
    mutationKey: QUERY_KEYS.DIARY.CREATE,
    mutationFn: (data: CreateDiaryPayload) => postDiary(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DIARY.LIST(year, month),
      })

      toast.success('일기가 저장되었습니다!')
      router.push('/')
    },

    onError: (error) => {
      console.error('일기 저장 중 에러 발생(usePostDiary):', error)
      toast.error('일기 저장 중 오류가 발생했습니다.')
    },
  })
}
