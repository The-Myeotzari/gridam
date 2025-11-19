'use client'

import { usePostDiary } from '@/features/diary-detail/api/queries/use-post-diary'
import { usePostDiaryImage } from '@/features/diary-detail/api/queries/use-post-diary-image'

export function useDiarySaveButton() {
  const { mutate: createDiary, isPending: createPending } = usePostDiary()
  const { mutateAsync: uploadImage, isPending: uploadPending } = usePostDiaryImage()

  const isPending = createPending || uploadPending

  const saveDiary = async (params: {
    date: string
    text: string
    canvas: string | null
    weather?: string
  }) => {
    if (isPending) return

    let imageUrl: string | null = null

    if (params.canvas) {
      const { url } = await uploadImage(params.canvas)
      imageUrl = url ?? null
    }

    createDiary({
      content: params.text,
      date: params.date,
      imageUrl,
      emoji: params.weather ?? '',
      meta: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    })
  }

  return { saveDiary, isPending }
}
