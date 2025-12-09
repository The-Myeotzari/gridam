'use client'

import DiaryFormButtons, {
  DIARY_STATUS,
  type DiaryStatus,
} from '@/features/diary/components/diary-form-buttons'
import { useDiaryActions } from '@/features/diary/hook/use-diary-action'
import type { Diary } from '@/features/feed/feed.type'
import { MESSAGES } from '@/shared/constants/messages'
import Textarea from '@/shared/ui/textarea'
import { useCanvasStore } from '@/store/canvas-store'
import { toast } from '@/store/toast-store'
import { useMemo, useState } from 'react'

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

  const trimmedText = text.trim()
  const originalText = (diary?.content ?? '').trim()
  const originalCanvas = diary?.image_url ?? null

  const isDirty = useMemo(() => {
    const textChanged = trimmedText === originalText
    const canvasChanged = canvas === originalCanvas
    return textChanged && canvasChanged
  }, [trimmedText, originalText, canvas, originalCanvas])

  const isInvalid = () => {
    if (!trimmedText && !canvas) {
      toast.error(MESSAGES.DIARY.ERROR.INVALID_ALL)
      return true
    }
    if (!trimmedText) {
      toast.error(MESSAGES.DIARY.ERROR.INVALID_TEXT)
      return true
    }
    if (!canvas && !isEdit) {
      toast.error(MESSAGES.DIARY.ERROR.INVALID_CANVAS)
      return true
    }
    return false
  }

  const commonParams = { diary, text, canvas, dateValue, weather }

  const runIfValid = (type: Parameters<typeof run>[0]['type']) => {
    if (isInvalid()) return
    run({ type, ...commonParams })
  }

  const handleSave = () => {
    if (diary?.status === DIARY_STATUS.DRAFT) runIfValid('publishDraft')
    else runIfValid('create')
  }

  const handleDraftSave = () => runIfValid('draftCreate')

  const handleUpdate = () => {
    if (isDirty) {
      toast.error(MESSAGES.DIARY.ERROR.UPDATE_NO_CHANGE)
      return
    }
    runIfValid('update')
  }

  const handleDraftUpdate = () => {
    toast.error(MESSAGES.DIARY.ERROR.DRAFT_UPDATE_NO_CHANGE)
    if (isDirty) return
    runIfValid('draftUpdate')
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <section className="p-5">
        <Textarea value={text} onChange={(v) => setText(v)} />
      </section>

      <DiaryFormButtons
        status={status}
        disabled={isPending}
        onSave={handleSave}
        onUpdate={handleUpdate}
        onTempSave={handleDraftSave}
        onTempUpdate={handleDraftUpdate}
      />
    </form>
  )
}
