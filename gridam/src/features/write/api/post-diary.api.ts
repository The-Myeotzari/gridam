import type { CreateDiaryPayload } from '@/features/write/types/diary'
import { api } from '@/lib/api'

export interface CreateDiaryResponse {
  data: { id: string } & CreateDiaryPayload
  ok: boolean
}

export async function postDiary(payload: CreateDiaryPayload) {
  const res = await api.post<CreateDiaryResponse>('/diaries', payload)
  const body = res.data
  if (!body.ok) {
    throw new Error('일기 저장에 실패했습니다.')
  }
  return body.data
}
