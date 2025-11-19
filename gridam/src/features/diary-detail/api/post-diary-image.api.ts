import { api } from '@/shared/lib/api'
import { getDataURLToBlob } from '@/shared/utils/get-data-url-to-blob'

export async function postDiaryImage(image: string) {
  const blob = await getDataURLToBlob(image)
  const formData = new FormData()
  formData.append('file', blob, 'canvas.png')

  const res = await api.post('/uploads', formData)

  if (!res.data?.data?.url) {
    console.error('[postDiaryImage] 업로드 실패: url 없음', res.data)
    throw new Error('이미지 URL을 받지 못했습니다.')
  }

  return {
    path: res.data.data.path,
    url: res.data.data.url,
  }
}
