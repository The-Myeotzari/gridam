'use client'

import { postDiary } from '@/features/diary-detail/api/post-diary.api'
import type { CreateDiaryPayload } from '@/features/diary-detail/types/diary'
import { MESSAGES } from '@/shared/constants/messages'
import { QUERY_KEYS } from '@/shared/constants/query-key'
import { toast } from '@/store/toast-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export function usePostDiary() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationKey: QUERY_KEYS.DIARY.CREATE,
    mutationFn: (payload: CreateDiaryPayload) => postDiary(payload),

    onSuccess: () => {
      queryClient.invalidateQueries()
      toast.success(MESSAGES.DIARY.SUCCESS.CREATE)
      router.push(`/`)
    },

    onError: (err) => {
      console.error(err)
      toast.error(MESSAGES.DIARY.ERROR.CREATE)
    },
  })
}
