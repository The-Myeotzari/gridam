'use client'

import { MESSAGES } from '@/constants/messages'
import { QUERY_KEYS } from '@/constants/query-key'
import { postDiary } from '@/features/diary-detail/api/post-diary.api'
import type { CreateDiaryPayload } from '@/features/diary-detail/types/diary'
import { resolveYearMonth } from '@/features/feed/utils/diary-date'
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

      toast.success(MESSAGES.DIARY.SUCCESS.CREATE)
      router.push('/')
    },

    onError: (error) => {
      console.error(MESSAGES.DIARY.ERROR.CREATE, error)
      toast.error(MESSAGES.DIARY.ERROR.CREATE)
    },
  })
}
