'use client'

import CanvasContainer from '@/features/canvas/canvas-container'
import { useCanvasStore } from '@/features/canvas/canvas-store'
import DiaryFormButtons, {
  DIARY_STATUS,
  type DiaryStatus,
} from '@/features/diary/components/diary-form-buttons'
import { useDiaryActions } from '@/features/diary/hook/use-diary-actiuon'
import type { Diary } from '@/features/feed/feed.type'
import { MESSAGES } from '@/shared/constants/messages'
import Textarea from '@/shared/ui/textarea'
import { toast } from '@/store/toast-store'
import { useState } from 'react'

type DiaryFormProps = {
  dateValue: string
  weather?: string
  isEdit?: boolean
  diary?: Diary | null
}

export default function DiaryForm({ dateValue, weather, isEdit = false, diary }: DiaryFormProps) {
  const [text, setText] = useState(diary?.content ?? '')
  const canvas = useCanvasStore((s) => s.image)

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

  const isInvalid = () => {
    if ((!text || text.trim().length === 0) && !canvas) {
      toast.error(MESSAGES.DIARY.ERROR.INVALID_ALL)
      return true
    }
    if (!text || text.trim().length === 0) {
      toast.error(MESSAGES.DIARY.ERROR.INVALID_TEXT)
      return true
    }
    if (!canvas) {
      toast.error(MESSAGES.DIARY.ERROR.INVALID_CANVAS)
      return true
    }
    return false
  }

  const handleSave = () => {
    if (isInvalid()) return
    if (diary?.status === DIARY_STATUS.DRAFT) {
      run({ type: 'publishDraft', ...commonParams })
    } else {
      run({ type: 'create', ...commonParams })
    }
  }

  const handleDraftSave = () => {
    if (isInvalid()) return
    run({ type: 'draftCreate', ...commonParams })
  }

  const handleUpdate = () => {
    if (isInvalid()) return
    run({ type: 'update', ...commonParams })
  }

  const handleDraftUpdate = () => {
    if (isInvalid()) return
    run({ type: 'draftUpdate', ...commonParams })
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <CanvasContainer initialImage={diary?.image_url} />

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
