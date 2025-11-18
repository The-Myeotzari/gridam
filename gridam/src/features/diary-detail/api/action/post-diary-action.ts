import type { CreateDiaryPayload, DiaryImageData } from '@/features/diary-detail/types/diary'
import { getDataURLToBlob } from '@/utils/get-data-url-to-blob'

type UploadImageArgs = {
  image: Blob
  filename?: string
}

type PostDiaryActionParams = {
  date: string
  text: string
  canvas: string
  weather: string
  createIsPending: boolean
  uploadIsPending: boolean
  createDiary: (args: CreateDiaryPayload) => void
  uploadImage: (args: UploadImageArgs) => Promise<DiaryImageData>
}

export async function postDiaryAction({
  date,
  text,
  canvas,
  weather,
  createIsPending,
  uploadIsPending,
  createDiary,
  uploadImage,
}: PostDiaryActionParams) {
  if (createIsPending || uploadIsPending) return

  let imageUrl: string | null = null

  if (canvas) {
    const blob = await getDataURLToBlob(canvas)
    const { url } = await uploadImage({
      image: blob,
      filename: 'canvas.png',
    })
    imageUrl = url ?? null
  }

  createDiary({
    content: text,
    date,
    imageUrl,
    emoji: weather,
    meta: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  })
}
