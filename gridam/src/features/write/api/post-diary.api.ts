import { api } from '@/lib/api'
import { CreateDiaryPayload, CreateDiaryResponse } from '../types/diary'

export async function postDiary(payload: CreateDiaryPayload) {
  const res = await api.post<CreateDiaryResponse>('/diaries', payload)
  return res.data
}
