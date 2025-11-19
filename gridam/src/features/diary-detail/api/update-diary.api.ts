import { api } from '@/lib/api'
import { getDataURLToBlob } from '@/utils/get-data-url-to-blob'

type UploadImageArgs = {
  image: Blob
  filename?: string
}

export async function updateDiary({
  id,
  text,
  canvas,
  uploadImage,
}: {
  id: string
  text: string
  canvas: string | null
  uploadImage: (args: UploadImageArgs) => Promise<{ url: string | null }>
}) {
  let imageUrl: string | null = null

  if (canvas) {
    const blob = await getDataURLToBlob(canvas)
    const { url } = await uploadImage({
      image: blob,
      filename: 'canvas.png',
    })
    imageUrl = url ?? null
  }

  await api.patch(`/diaries/${id}`, {
    content: text,
    imageUrl,
  })
}
