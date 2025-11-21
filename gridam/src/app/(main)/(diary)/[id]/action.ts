'use server'

import { updateImageAction } from '@/features/diary/image.action'
import type { Diary } from '@/features/feed/feed.type'
import { MESSAGES } from '@/shared/constants/messages'
import { getCookies } from '@/shared/utils/getCookies'

export async function getDiaryAction(id: string) {
  if (!id) throw new Error(MESSAGES.DIARY.ERROR.READ)
  const cookieHeader = await getCookies()

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/diaries/${id}`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    next: { revalidate: 0 },
    headers: {
      Cookie: cookieHeader,
    },
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
  const patchRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`, {
    method: 'PATCH',
    credentials: 'include',
    cache: 'no-store',
    next: { revalidate: 0 },
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify({
      id,
      content,
      imageUrl: uploadedUrl,
    }),
  })

  return patchRes.json()
}
