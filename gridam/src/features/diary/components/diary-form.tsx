'use client'

import { saveDiaryAction, updateDiaryAction } from '@/app/(main)/(diary)/write/action'
import CanvasContainer from '@/features/canvas/canvas-container'
import DiaryCancelButton from '@/features/diary/components/buttons/diary-cancel-button'
import DiarySaveButton from '@/features/diary/components/buttons/diary-save-button'
import DiaryUpdateButton from '@/features/diary/components/buttons/diary-update-button'
import { MESSAGES } from '@/shared/constants/messages'
import Textarea from '@/shared/ui/textarea'
import { toast } from '@/store/toast-store'
import { useRouter } from 'next/navigation'
import { useOptimistic, useState, useTransition } from 'react'

type DiaryFormProps = {
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
}: DiaryFormProps) {
  const router = useRouter()

  const [text, setText] = useState(initialContent ?? '')
  const [canvas, setCanvas] = useState<string | null>(initialImage ?? null)

  const [optimisticText, updateOptimisticText] = useOptimistic<string, string>(
    text,
    (_, next) => next
  )

  const [isPending, startTransition] = useTransition()

  const handleSave = () => {
    startTransition(async () => {
      try {
        updateOptimisticText(text)

        const res = await saveDiaryAction({
          date: dateValue,
          content: text,
          imageUrl: canvas,
          emoji: weather,
          meta: {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        })

        if (res.ok) {
          toast.success(MESSAGES.DIARY.SUCCESS.CREATE)
          router.push('/')
        } else {
          toast.error(MESSAGES.DIARY.ERROR.CREATE)
        }
      } catch (e) {
        toast.error(MESSAGES.DIARY.ERROR.CREATE)
      }
    })
  }

  const handleUpdate = () => {
    if (!diaryId) return

    startTransition(async () => {
      try {
        updateOptimisticText(text)

        const res = await updateDiaryAction({
          id: diaryId,
          content: text,
          imageUrl: canvas,
        })

        if (res.ok) {
          toast.success(MESSAGES.DIARY.SUCCESS.UPDATE)
          router.push('/')
        } else {
          toast.error(MESSAGES.DIARY.ERROR.UPDATE)
        }
      } catch (e) {
        toast.error(MESSAGES.DIARY.ERROR.UPDATE)
      }
    })
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <CanvasContainer initialImage={initialImage} onChange={setCanvas} />

      <section className="p-5">
        <Textarea value={optimisticText} onChange={(v) => setText(v)} />
      </section>

      <div className="text-center mb-4">
        <DiaryCancelButton />

        {isEdit && diaryId ? (
          <DiaryUpdateButton isPending={isPending} onClick={handleUpdate} />
        ) : (
          <DiarySaveButton isPending={isPending} onClick={handleSave} />
        )}
      </div>
    </form>
  )
}
