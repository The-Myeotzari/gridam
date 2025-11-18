import { QUERY_KEYS } from '@/constants/query-key'
import { postDiaryImage } from '@/features/diary-detail/api/post-diary-image.api'
import { useMutation } from '@tanstack/react-query'

export function usePostDiaryImage() {
  return useMutation({
    mutationKey: QUERY_KEYS.STORAGE.UPLOAD,
    mutationFn: ({ image, filename }: { image: Blob; filename?: string }) =>
      postDiaryImage(image, filename),
  })
}
