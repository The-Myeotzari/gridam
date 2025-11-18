import type { DiaryImageData } from '@/features/diary-detail/types/diary'
import { api } from '@/lib/api'

interface UploadDiaryImageResponse {
  data: DiaryImageData
}

export async function postDiaryImage(image: Blob, filename?: string): Promise<DiaryImageData> {
  const formData = new FormData()
  formData.append('file', image)
  if (filename) {
    formData.append('filename', filename)
  }
  const res = await api.post<UploadDiaryImageResponse>('/uploads', formData)
  if (res.status < 200 || res.status >= 300) {
    throw new Error('이미지 업로드에 실패했습니다.')
  }
  return res.data.data
}
