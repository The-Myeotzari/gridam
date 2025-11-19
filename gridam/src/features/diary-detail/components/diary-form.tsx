'use client'
// 어떻게 최소한의 클라이언트로 만들지

import Textarea from '@/components/ui/textarea'
import CanvasContainer from '@/features/diary-detail/components/canvas/canvas-container'
import { useDiaryForm } from '@/features/diary-detail/hooks/use-diary-form'
import { useEffect, useState } from 'react'
import { useDiarySaveButton } from '../hooks/use-diary-save-button'
import { useDiaryUpdateButton } from '../hooks/use-diary-update-button'
import DiaryCancelButton from './buttons/diary-cancel-button'
import DiarySaveButton from './buttons/diary-save-button'
import DiaryUpdateButton from './buttons/diary-update-button'

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

  const saveButton = useDiarySaveButton()
  const updateButton = useDiaryUpdateButton()

  useEffect(() => {
    setDate(dateValue)
    if (initialContent) setText(initialContent)
  }, [dateValue, initialContent, setDate, setText])

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <CanvasContainer initialImage={initialImage} onChange={(img) => setCanvas(img)} />

      <section className="p-5">
        <Textarea value={text} onChange={(v) => setText(v)} />
      </section>

      <div className="text-center mb-4">
        <DiaryCancelButton />

        {/* 개선 필요 */}
        {isEdit && diaryId ? (
          <DiaryUpdateButton
            isPending={updateButton.isPending}
            onClick={() =>
              updateButton.update({
                id: diaryId,
                text,
                canvas,
              })
            }
          />
        ) : (
          <DiarySaveButton
            isPending={saveButton.isPending}
            onClick={() =>
              saveButton.saveDiary({
                date,
                text,
                canvas,
                weather,
              })
            }
          />
        )}
      </div>
    </form>
  )
}
