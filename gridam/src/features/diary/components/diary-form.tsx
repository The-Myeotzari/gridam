'use client'

import CanvasContainer from '@/features/canvas/canvas-container'
import DiaryFormButtons, {
  DIARY_STATUS,
  type DiaryStatus,
} from '@/features/diary/components/diary-form-buttons'
import type { Diary } from '@/features/feed/feed.type'
import Textarea from '@/shared/ui/textarea'
import { useState } from 'react'
import { useDiaryActions } from '../hook/use-diary-actiuon'

type DiaryFormProps = {
  dateValue: string
  weather?: string
  isEdit?: boolean
  diary?: Diary | null
}

export default function DiaryForm({ dateValue, weather, isEdit = false, diary }: DiaryFormProps) {
  const [text, setText] = useState(diary?.content ?? '')
  const [canvas, setCanvas] = useState<string | null>(diary?.image_url ?? null)

  const { run, isPending } = useDiaryActions()

  const status: DiaryStatus = (() => {
    if (!isEdit) return DIARY_STATUS.NEW
    if (diary?.status === DIARY_STATUS.DRAFT) return DIARY_STATUS.DRAFT
    return DIARY_STATUS.PUBLISHED
  })()

  const commonParams = {
    diary,
    text,
    canvas,
    dateValue,
    weather,
  }

  const handleSave = () => {
    if (diary?.status === DIARY_STATUS.DRAFT) {
      run({ type: 'publishDraft', ...commonParams })
    } else {
      run({ type: 'create', ...commonParams })
    }
  }

  const handleDraftSave = () => run({ type: 'draftCreate', ...commonParams })
  const handleUpdate = () => run({ type: 'update', ...commonParams })
  const handleDraftUpdate = () => run({ type: 'draftUpdate', ...commonParams })

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <CanvasContainer initialImage={diary?.image_url} onChange={setCanvas} />

      <section className="p-5">
        <Textarea value={text} onChange={(v) => setText(v)} />
      </section>

      <DiaryFormButtons
        status={status}
        isPending={isPending}
        onSave={handleSave}
        onUpdate={handleUpdate}
        onTempSave={handleDraftSave}
        onTempUpdate={handleDraftUpdate}
      />
    </form>
  )
}
