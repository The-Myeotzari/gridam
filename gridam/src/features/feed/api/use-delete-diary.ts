'use client'

import { MESSAGES } from '@/constants/messages'
import { QUERY_KEYS } from '@/constants/query-key'
import { resolveYearMonth } from '@/features/feed/utils/diary-date'
import { toast } from '@/store/toast-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { deleteDiary } from './delete-diary.api'

export function useDeleteDiary() {
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()

  const params = {
    year: searchParams.get('year') ?? undefined,
    month: searchParams.get('month') ?? undefined,
  }

  const { year, month } = resolveYearMonth(params)

  return useMutation({
    mutationFn: async (diaryId: string) => await deleteDiary(diaryId),
    onSuccess: () => {
      toast.success(MESSAGES.DIARY.SUCCESS.DELETE)
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DIARY.LIST(year, month),
      })
    },
    onError: () => {
      toast.error(MESSAGES.DIARY.ERROR.DELETE)
    },
  })
}
