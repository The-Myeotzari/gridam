'use client'

import { MESSAGES } from '@/constants/messages'
import { QUERY_KEYS } from '@/constants/query-key'
import { updateDiary } from '@/features/diary-detail/api/update-diary.api'
import { toast } from '@/store/toast-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export function useUpdateDiary() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationKey: QUERY_KEYS.DIARY.UPDATE,
    mutationFn: updateDiary,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DIARY.DETAIL(variables.id),
      })
      toast.success(MESSAGES.DIARY.SUCCESS.UPDATE)
      router.push(`/`)
    },

    onError: (err) => {
      console.error(err)
      toast.error(MESSAGES.DIARY.ERROR.UPDATE)
    },
  })
}
