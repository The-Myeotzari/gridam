'use server'

import { updateImageAction } from '@/features/diary/apis/image.action'
import type { Diary } from '@/features/feed/feed.type'
import { API_ENDPOINTS } from '@/shared/constants/api.endpoints'
import { MESSAGES } from '@/shared/constants/messages'
import { api } from '@/shared/lib/fetch-api'
import { getCookies } from '@/shared/utils/get-cookies'

export async function getDiaryAction(id: string) {
  if (!id) throw new Error(MESSAGES.DIARY.ERROR.READ)
  const cookieHeader = await getCookies()

  const res = await api(`${API_ENDPOINTS.DIARIES.BY_ID(id)}`, {
    cookieHeader,
  })

  const json = await res.json()
  if (!res.ok || !json?.ok) {
    return { ok: false, data: {} as Diary }
  }
  const diary = json.data

  return {
    ok: true,
    data: diary,
  }
}

const ENDPOINTS = {
  diary: (id: string) => `diaries/${id}`,
  draft: (id: string) => `drafts/${id}`,
  publish: (id: string) => `drafts/${id}/publish`,
}
type DiaryActionType = keyof typeof ENDPOINTS

type DiaryDrafcAction = {
  id: string
  content: string
  imageUrl: string | null
  oldImagePath?: string | null
  isImageChanged: boolean
  type: DiaryActionType
}

export async function updateDiaryAction(form: DiaryDrafcAction) {
  const cookieHeader = await getCookies()
  const { id, content, imageUrl, isImageChanged, oldImagePath, type } = form

  const uploadedUrl = await updateImageAction({
    imageUrl,
    oldImagePath,
    isImageChanged,
    cookieHeader,
  })

  const endpoint = ENDPOINTS[type](id)
  const patchRes = await api(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`, {
    method: 'PATCH',
    cookieHeader,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      content,
      imageUrl: uploadedUrl,
    }),
  })

  return patchRes.json()
}
