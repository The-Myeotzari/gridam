'use client'

import { QUERY_KEYS } from '@/constants/query-key'
import { updateDiary } from '@/features/diary-detail/api/update-diary.api'
import { toast } from '@/store/toast-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

type UpdateDiaryPayload = {
  id: string
  text: string
  canvas: string | null
  uploadImage: (args: { image: Blob; filename?: string }) => Promise<{ url: string | null }>
}

export function useUpdateDiary() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationKey: QUERY_KEYS.DIARY.UPDATE,
    mutationFn: (data: UpdateDiaryPayload) => updateDiary(data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DIARY.DETAIL(variables.id),
      })

      toast.success('일기가 수정되었습니다!')
      router.push(`/`)
    },

    onError: (error) => {
      console.error('일기 수정 실패:', error)
      toast.error('일기 수정 중 오류가 발생했습니다.')
    },
  })
}
