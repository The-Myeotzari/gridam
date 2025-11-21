'use server'

import type { Diary } from '@/features/feed/feed.type'
import { MESSAGES } from '@/shared/constants/messages'
import { DraftUpdateSchema } from '@/shared/types/zod/apis/draft-schema'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { getBlobToFile, getDataURLToBlob } from '@/shared/utils/get-data-url-to-blob'
import getSupabaseServer from '@/shared/utils/supabase/server'
import { withSignedImageUrls } from '@/shared/utils/supabase/with-signed-image-urls'
import { uploadDiaryImage } from '@/shared/utils/uploads/upload-diary-image'
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

type DiaryDrafcAction = {
  id: string
  content: string
  imageUrl: string | null
  oldImagePath?: string | null
  isImageChanged: boolean
}

export async function updateDiaryAction(form: DiaryDrafcAction) {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

  const { id, content, imageUrl, isImageChanged, oldImagePath } = form
  let uploadURL = (imageUrl ? imageUrl : oldImagePath) ?? ''

  if (isImageChanged && imageUrl) {
    const blob = await getDataURLToBlob(uploadURL)
    const file = getBlobToFile(blob, 'image.png')

    const uploadForm = new FormData()
    uploadForm.append('file', file)

    const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads`, {
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

    uploadURL = uploadJson.data?.url ?? null

    // NOTE: 이미지 파일 교체 이후 기존 이미지 삭제 여부 필요? -> 히스토리 기능이 들어갈까?
  }

  const patchRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/diaries/${id}`, {
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

type DiaryPatch = {
  content?: string
  image_url?: string | null
  published_at?: string | null
}

export async function updateDiaryDraftAction(form: DiaryDrafcAction) {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

  const { id, content, imageUrl, isImageChanged, oldImagePath } = form
  let uploadURL = (imageUrl ? imageUrl : oldImagePath) ?? ''

  if (isImageChanged && imageUrl) {
    const blob = await getDataURLToBlob(uploadURL)
    const file = getBlobToFile(blob, 'image.png')

    const uploadForm = new FormData()
    uploadForm.append('file', file)

    const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads`, {
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

    uploadURL = uploadJson.data?.url ?? null

    // NOTE: 이미지 파일 교체 이후 기존 이미지 삭제 여부 필요? -> 히스토리 기능이 들어갈까?
  }

  const patchRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/drafts/${id}`, {
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

export async function saveDiaryPublishedAction(form: {
  id: string
  content: string
  imageUrl: string | null
}) {
  try {
    const { supabase, user } = await getAuthenticatedUser()
    if (!user) throw new Error(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER)

    const parsed = DraftUpdateSchema.safeParse(form)
    if (!parsed.success) throw new Error(MESSAGES.DIARY.ERROR.DRAFT_CREATE)

    const { id, content, imageUrl } = parsed.data

    let uploadedUrl: string | null = null
    if (imageUrl) {
      const { url } = await uploadDiaryImage(imageUrl, user.id)
      uploadedUrl = url
    }

    const { data, error } = await supabase
      .from('diaries')
      .update({ status: 'published', published_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .select('id,status,published_at,date')
      .single()

    if (error) throw new Error(MESSAGES.DIARY.ERROR.DRAFT_CREATE)
    return { ok: true, data: data }
  } catch (err) {
    return { ok: false }
  }
}
