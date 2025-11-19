'use client'

import { usePostDiaryImage } from '@/features/diary-detail/api/queries/use-post-diary-image'
import { useUpdateDiary } from '@/features/diary-detail/api/queries/use-update-diary'

export function useDiaryUpdateButton() {
  const { mutate: updateDiary, isPending: updatePending } = useUpdateDiary()
  const { mutateAsync: uploadImage, isPending: uploadPending } = usePostDiaryImage()

  const isPending = updatePending || uploadPending

  const update = async (params: { id: string; text: string; canvas: string | null }) => {
    if (isPending) return

    let imageUrl: string | null = null

    if (params.canvas) {
      const { url } = await uploadImage(params.canvas)
      imageUrl = url ?? null
    }

    updateDiary({
      id: params.id,
      text: params.text,
      imageUrl,
    })
  }

  return { update, isPending }
}
