import { MESSAGES } from '@/shared/constants/messages'
import axios from 'axios'

export async function deleteDiary(diaryId: string) {
  const res = await axios.delete(`/apis/diaries/${diaryId}`)
  if (res.status < 200 || res.status >= 300) throw new Error(MESSAGES.DIARY.ERROR.DELETE)
  return res
}
