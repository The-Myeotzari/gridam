import type { CreateDiaryPayload } from '@/features/diary-detail/types/diary'
import { MESSAGES } from '@/shared/constants/messages'
import axios from 'axios'

export interface CreateDiaryResponse {
  data: { id: string } & CreateDiaryPayload
  ok: boolean
}

export async function postDiary(payload: CreateDiaryPayload) {
  const res = await axios.post<CreateDiaryResponse>('/apis/diaries', payload)
  const body = res.data
  if (!body.ok) {
    throw new Error(MESSAGES.DIARY.ERROR.CREATE)
  }
  return body.data
}
