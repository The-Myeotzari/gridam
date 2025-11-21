'use server'

import type { Diary } from '@/features/feed/feed.type'
import { MESSAGES } from '@/shared/constants/messages'
import { getBlobToFile, getDataURLToBlob } from '@/shared/utils/get-data-url-to-blob'
import getSupabaseServer from '@/shared/utils/supabase/server'
import {
  parseStorageUrl,
  withSignedImageUrls,
} from '@/shared/utils/supabase/with-signed-image-urls'
import { cookies } from 'next/headers'

export async function getDiaryAction(id: string) {
  if (!id) throw new Error(MESSAGES.DIARY.ERROR.READ)

  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

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

  const supabase = await getSupabaseServer()
  const [signedDiary] = await withSignedImageUrls(supabase, [diary])

  return {
    ok: true,
    data: signedDiary,
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

async function uploadImageIfNeeded({
  imageUrl,
  oldImagePath,
  isImageChanged,
  cookieHeader,
}: {
  imageUrl: string | null
  oldImagePath?: string | null
  isImageChanged: boolean
  cookieHeader: string
}) {
  let finalUrl = imageUrl ?? oldImagePath ?? ''

  if (!isImageChanged || !imageUrl) return finalUrl

  const blob = await getDataURLToBlob(imageUrl)
  const file = getBlobToFile(blob, 'image.png')

  const form = new FormData()
  form.append('file', file)

  const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads`, {
    method: 'POST',
    credentials: 'include',
    headers: { Cookie: cookieHeader },
    body: form,
  })

  const uploadJson = await uploadRes.json()
  if (!uploadRes.ok) throw new Error(uploadJson.message || '이미지 업로드 실패')

  return uploadJson.data?.url ?? null
  // NOTE: 이미지 파일 교체 이후 기존 이미지 삭제 여부 필요? -> 히스토리 기능이 들어갈까?
}

export async function updateDiaryAction(form: DiaryDrafcAction) {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

  const { id, content, imageUrl, isImageChanged, oldImagePath, type } = form
  let uploadURL = (imageUrl ? imageUrl : oldImagePath) ?? ''

  const uploadedUrl = await uploadImageIfNeeded({
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
      imageUrl: uploadURL,
    }),
  })

  return patchRes.json()
}

export async function saveDiaryPublishedAction(form: Omit<DiaryDrafcAction, 'type'>) {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

  const { id, content, imageUrl, oldImagePath, isImageChanged } = form

  let finalUrl = imageUrl ?? ''
  if (!isImageChanged || !imageUrl || !oldImagePath) return finalUrl

  if (isImageChanged && imageUrl) {
    const parsed = parseStorageUrl(oldImagePath)
    if (!parsed) {
      console.warn('⚠ oldImagePath가 올바른 Supabase storage URL이 아닙니다', oldImagePath)
      throw new Error('oldImagePath 변환 실패')
    }

    const oldPath = parsed.path

    const blob = await getDataURLToBlob(finalUrl)
    const file = getBlobToFile(blob, 'image.png')

    const uploadForm = new FormData()
    uploadForm.append('file', file)
    uploadForm.append('oldPath', oldPath)

    const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/replace`, {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      next: { revalidate: 0 },
      headers: {
        Cookie: cookieHeader,
      },
      body: uploadForm,
    })

    const uploadJson = await uploadRes.json()
    if (!uploadRes.ok) {
      throw new Error(uploadJson.message || '이미지 업로드 실패')
    }

    finalUrl = uploadJson.data?.url ?? null

    // NOTE: 이미지 파일 교체 이후 기존 이미지 삭제 여부 필요? -> 히스토리 기능이 들어갈까?
  }

  const patchRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/drafts/${id}/publish`, {
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
      imageUrl: finalUrl,
    }),
  })

  return patchRes.json()
}
