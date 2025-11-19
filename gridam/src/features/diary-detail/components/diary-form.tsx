'use client'
// 어떻게 최소한의 클라이언트로 만들지

import Textarea from '@/components/ui/textarea'
import { MESSAGES } from '@/constants/messages'
import { postDiaryAction } from '@/features/diary-detail/api/action/post-diary-action'
import { usePostDiary } from '@/features/diary-detail/api/queries/use-post-diary'
import { usePostDiaryImage } from '@/features/diary-detail/api/queries/use-post-diary-image'
import { useUpdateDiary } from '@/features/diary-detail/api/queries/use-update-diary'
import CanvasContainer from '@/features/diary-detail/components/canvas/canvas-container'
import DiaryFormButton from '@/features/diary-detail/components/diary-form-button'
import { useDiaryForm } from '@/features/diary-detail/hooks/use-diary-form'
import { useEffect, useState } from 'react'
import DiaryCancelButton from './buttons/diary-cancel-button'

type props = {
  dateValue: string
  weather?: string
  isEdit?: boolean
  diaryId?: string
  initialContent?: string
  initialImage?: string | null
}

export default function DiaryForm({
  dateValue,
  weather,
  isEdit = false,
  diaryId,
  initialContent,
  initialImage,
}: props) {
  const { date, text, setText, setDate } = useDiaryForm()
  const [canvas, setCanvas] = useState<string | null>(initialImage ?? null)

  const { mutate: createDiary, isPending: createPending } = usePostDiary()
  const { mutateAsync: uploadImage, isPending: uploadPending } = usePostDiaryImage()
  const { mutate: updateDiaryMutate, isPending: updatePending } = useUpdateDiary()

  useEffect(() => {
    setDate(dateValue)
    if (initialContent) setText(initialContent)
  }, [dateValue, initialContent, setDate, setText])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isEdit && diaryId) {
      updateDiaryMutate({
        id: diaryId,
        text,
        canvas,
        uploadImage,
      })
      return
    }

    await postDiaryAction({
      date,
      text,
      canvas: canvas ?? '',
      // 예외처리 어떻게 할지 고민 필요 - 날씨 데이터 조회 실패하면 이미지 없이? 아니면 기본이미지?
      weather: weather ?? '/fallback-weather.png',
      createIsPending: createPending,
      uploadIsPending: uploadPending,
      createDiary,
      uploadImage,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <CanvasContainer initialImage={initialImage} onChange={(img) => setCanvas(img)} />

      <section className="p-5">
        <Textarea value={text} onChange={(v) => setText(v)} />
      </section>

      <div className="text-center mb-4">
        <DiaryCancelButton />

        <DiaryFormButton
          label={isEdit ? MESSAGES.COMMON.UPDATE_BUTTON : MESSAGES.COMMON.SAVE_BUTTON}
          type="submit"
          variant="blue"
          isPending={createPending || uploadPending || updatePending}
          className="ml-2"
        />
      </div>
    </form>
  )
}
