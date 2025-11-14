import { useCanvasStore } from '@/features/write/store/canvas-store'
import { useWriteStore } from '@/features/write/store/write-store'
import type { CreateDiaryPayload, DiaryImageData } from '@/features/write/types/diary'
import { getDataURLToBlob } from '@/utils/get-data-url-to-blob'

type UploadImageArgs = {
  image: Blob
  filename?: string
}

type PostDiaryActionParams = {
  date: string
  weather: string
  createIsPending: boolean
  uploadIsPending: boolean
  createDiary: (args: CreateDiaryPayload) => void
  uploadImage: (args: UploadImageArgs) => Promise<DiaryImageData>
}

export async function postDiaryAction({
  date,
  weather,
  createIsPending,
  uploadIsPending,
  createDiary,
  uploadImage,
}: PostDiaryActionParams) {
  if (createIsPending || uploadIsPending) return

  const textState = useWriteStore.getState()
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
    content: textState.text,
    date,
    imageUrl,
    emoji: weather,
    meta: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  })
}
