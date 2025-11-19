import { MESSAGES } from '@/constants/messages'
import { api } from '@/lib/api'

export async function deleteDiary(diaryId: string) {
  const res = await api.delete(`/diaries/${diaryId}`)
  if (res.status < 200 || res.status >= 300) throw new Error(MESSAGES.DIARY.ERROR.DELETE)
  return res
}
