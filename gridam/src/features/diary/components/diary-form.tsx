'use client'

import {
  saveDiaryPublishedAction,
  updateDiaryAction,
  updateDiaryDraftAction,
} from '@/app/(main)/(diary)/[id]/action'
import { saveDiaryAction, saveDiaryDraftAction } from '@/app/(main)/(diary)/write/action'
import CanvasContainer from '@/features/canvas/canvas-container'
import DiaryFormButtons, {
  DIARY_STATUS,
  DiaryStatus,
} from '@/features/diary/components/diary-form-buttons'
import { Diary } from '@/features/feed/feed.type'
import { MESSAGES } from '@/shared/constants/messages'
import Textarea from '@/shared/ui/textarea'
import { toast } from '@/store/toast-store'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

type DiaryFormProps = {
  dateValue: string
  weather?: string
  isEdit?: boolean
  diary?: Diary | null
}

export default function DiaryForm({ dateValue, weather, isEdit = false, diary }: DiaryFormProps) {
  const router = useRouter()

  const [text, setText] = useState(diary?.content ?? '')
  const [canvas, setCanvas] = useState<string | null>(diary?.image_url ?? null)

  const [isPending, startTransition] = useTransition()

  const status: DiaryStatus = (() => {
    if (!isEdit) return DIARY_STATUS.NEW
    if (isEdit && diary?.status === DIARY_STATUS.DRAFT) return DIARY_STATUS.DRAFT
    return DIARY_STATUS.PUBLISHED
  })()

  const handleSave = () => {
    startTransition(async () => {
      try {
        const isDraft = diary?.status === DIARY_STATUS.DRAFT
        const commonPayload = {
          content: text,
          imageUrl: canvas,
          emoji: weather,
          meta: {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        }

        let res

        if (isDraft) {
          if (!diary?.id) {
            toast.error(MESSAGES.DIARY.ERROR.DRAFT_SAVE)
            return
          }
          res = await saveDiaryPublishedAction({
            id: diary.id,
            ...commonPayload,
          })

          if (res.ok) {
            toast.success(MESSAGES.DIARY.SUCCESS.DRAFT_SAVE)
            router.push('/')
          } else {
            toast.error(MESSAGES.DIARY.ERROR.DRAFT_SAVE)
          }
          return
        }

        res = await saveDiaryAction({
          date: dateValue,
          ...commonPayload,
        })
        if (res.ok) {
          toast.success(MESSAGES.DIARY.SUCCESS.CREATE)
          router.push('/')
        } else {
          toast.error(MESSAGES.DIARY.ERROR.CREATE)
        }
      } catch {
        toast.error(MESSAGES.DIARY.ERROR.CREATE)
      }
    })
  }

  const handleDraftSave = () => {
    startTransition(async () => {
      try {
        const res = await saveDiaryDraftAction({
          date: dateValue,
          content: text,
          imageUrl: canvas,
          emoji: weather,
          meta: {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        })

        if (res.ok) {
          toast.success(MESSAGES.DIARY.SUCCESS.DRAFT_CREATE)
          router.push('/draft')
        } else {
          toast.error(MESSAGES.DIARY.ERROR.DRAFT_CREATE)
        }
      } catch (e) {
        toast.error(MESSAGES.DIARY.ERROR.DRAFT_CREATE)
      }
    })
  }

  const handleUpdate = () => {
    if (!diary?.id) return

    startTransition(async () => {
      try {
        const res = await updateDiaryAction({
          id: diary.id,
          content: text,
          imageUrl: canvas ?? diary.image_url,
          oldImagePath: diary.image_url,
          isImageChanged: true,
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

  const handleDraftUpdate = () => {
    if (!diary?.id) return

    startTransition(async () => {
      try {
        const res = await updateDiaryDraftAction({
          id: diary.id,
          content: text,
          imageUrl: canvas ?? diary.image_url,
          oldImagePath: diary.image_url,
          isImageChanged: true,
        })

        if (res.ok) {
          toast.success(MESSAGES.DIARY.SUCCESS.DRAFT_UPDATE)
          router.push('/draft')
        } else {
          toast.error(MESSAGES.DIARY.ERROR.DRAFT_UPDATE)
        }
      } catch (e) {
        toast.error(MESSAGES.DIARY.ERROR.DRAFT_UPDATE)
      }
    })
  }

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
