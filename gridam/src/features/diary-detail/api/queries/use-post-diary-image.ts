'use client'

import { postDiaryImage } from '@/features/diary-detail/api/post-diary-image.api'
import { toast } from '@/store/toast-store'
import { useMutation } from '@tanstack/react-query'

export function usePostDiaryImage() {
  return useMutation({
    mutationFn: postDiaryImage,

    onError: (err) => {
      console.error('[usePostDiaryImage] 이미지 업로드 실패:', err)
      toast.error('이미지 업로드에 실패했습니다.')
    },
  })
}
