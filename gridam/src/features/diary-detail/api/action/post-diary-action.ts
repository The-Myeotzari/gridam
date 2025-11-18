import { useCanvasStore } from '@/features/diary-detail/store/canvas-store'
import type { CreateDiaryPayload, DiaryImageData } from '@/features/diary-detail/types/diary'
import { getDataURLToBlob } from '@/utils/get-data-url-to-blob'

type UploadImageArgs = {
  image: Blob
  filename?: string
}

type PostDiaryActionParams = {
  date: string
  text: string
  weather: string
  createIsPending: boolean
  uploadIsPending: boolean
  createDiary: (args: CreateDiaryPayload) => void
  uploadImage: (args: UploadImageArgs) => Promise<DiaryImageData>
}

export async function postDiaryAction({
  date,
  text,
  weather,
  createIsPending,
  uploadIsPending,
  createDiary,
  uploadImage,
}: PostDiaryActionParams) {
  if (createIsPending || uploadIsPending) return

  const canvasState = useCanvasStore.getState()

  let imageUrl: string | null = null

  if (canvasState.canvas) {
    const blob = await getDataURLToBlob(canvasState.canvas)
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
