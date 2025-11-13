import { useMutation } from '@tanstack/react-query'
import { CreateDiaryPayload } from '../../types/diary'
import { postDiary } from '../post-diary.api'

export function usePostDiary() {
  return useMutation({
    mutationFn: (data: CreateDiaryPayload) => postDiary(data),
  })
}
