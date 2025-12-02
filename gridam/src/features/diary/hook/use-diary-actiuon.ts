'use client'

import { updateDiaryAction } from '@/app/(main)/(diary)/[id]/action'
import { saveDiaryAction } from '@/app/(main)/(diary)/write/action'
import { checkImageChanged } from '@/features/diary/utils/check-image-changed'
import type { Diary } from '@/features/feed/feed.type'
import { MESSAGES } from '@/shared/constants/messages'
import { toast } from '@/store/toast-store'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

type RunActionParams = {
  type: 'create' | 'draftCreate' | 'publishDraft' | 'update' | 'draftUpdate'
  diary?: Diary | null
  text: string
  canvas: string | null
  dateValue: string
  weather?: string
}

export function useDiaryActions() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const run = ({ type, diary, text, canvas, dateValue, weather }: RunActionParams) => {
    startTransition(async () => {
      try {
        const actionConfig = buildConfig({ type, diary, text, canvas, dateValue, weather })
        if (!actionConfig) return

        const { actionFn, payload, success, error, redirect } = actionConfig

        const res = await actionFn(payload)

        if (res.ok) {
          toast.success(success)
          router.push(redirect)
        } else {
          toast.error(error)
        }
      } catch {
        const actionConfig = buildConfig({ type, diary, text, canvas, dateValue, weather })
        if (actionConfig) toast.error(actionConfig.error)
      }
    })
  }

  return { run, isPending }
}

function buildConfig({ type, diary, text, canvas, dateValue, weather }: RunActionParams) {
  switch (type) {
    case 'create':
      return {
        actionFn: saveDiaryAction,
        payload: {
          date: dateValue,
          content: text,
          imageUrl: canvas,
          emoji: weather,
          meta: { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
          type: 'diaries',
        },
        success: MESSAGES.DIARY.SUCCESS.CREATE,
        error: MESSAGES.DIARY.ERROR.CREATE,
        redirect: '/',
      }

    case 'draftCreate':
      return {
        actionFn: saveDiaryAction,
        payload: {
          date: dateValue,
          content: text,
          imageUrl: canvas,
          emoji: weather,
          meta: { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
          type: 'drafts',
        },
        success: MESSAGES.DIARY.SUCCESS.DRAFT_CREATE,
        error: MESSAGES.DIARY.ERROR.DRAFT_CREATE,
        redirect: '/draft',
      }

    case 'publishDraft': {
      if (!diary?.id) {
        toast.error(MESSAGES.DIARY.ERROR.DRAFT_SAVE)
        return null
      }

      const isChanged = checkImageChanged(diary.image_url, canvas)

      const payload: any = {
        id: diary.id,
        content: text,
        imageUrl: canvas ?? diary.image_url,
        isImageChanged: isChanged,
        type: 'publish',
      }

      if (isChanged && diary.image_url) {
        payload.oldImagePath = diary.image_url
      }

      return {
        actionFn: updateDiaryAction,
        payload,
        success: MESSAGES.DIARY.SUCCESS.DRAFT_SAVE,
        error: MESSAGES.DIARY.ERROR.DRAFT_SAVE,
        redirect: '/',
      }
    }

    case 'update': {
      if (!diary?.id) {
        toast.error(MESSAGES.DIARY.ERROR.UPDATE)
        return null
      }

      const isChanged = checkImageChanged(diary.image_url, canvas)

      const payload: any = {
        id: diary.id,
        content: text,
        imageUrl: canvas ?? diary.image_url,
        isImageChanged: isChanged,
        type: 'diary',
      }

      if (isChanged && diary.image_url) {
        payload.oldImagePath = diary.image_url
      }

      return {
        actionFn: updateDiaryAction,
        payload,
        success: MESSAGES.DIARY.SUCCESS.UPDATE,
        error: MESSAGES.DIARY.ERROR.UPDATE,
        redirect: '/',
      }
    }

    case 'draftUpdate': {
      if (!diary?.id) {
        toast.error(MESSAGES.DIARY.ERROR.DRAFT_UPDATE)
        return null
      }

      const isChanged = checkImageChanged(diary.image_url, canvas)

      const payload: any = {
        id: diary.id,
        content: text,
        imageUrl: canvas ?? diary.image_url,
        isImageChanged: isChanged,
        type: 'draft',
      }

      if (isChanged && diary.image_url) {
        payload.oldImagePath = diary.image_url
      }

      return {
        actionFn: updateDiaryAction,
        payload,
        success: MESSAGES.DIARY.SUCCESS.DRAFT_UPDATE,
        error: MESSAGES.DIARY.ERROR.DRAFT_UPDATE,
        redirect: '/draft',
      }
    }

    default:
      return null
  }
}
