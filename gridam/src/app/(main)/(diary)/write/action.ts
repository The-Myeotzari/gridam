'use server'

import { getBlobToFile, getDataURLToBlob } from '@/shared/utils/get-data-url-to-blob'
import { cookies } from 'next/headers'

type SaveDiaryAction = {
  date: string
  content: string
  imageUrl: string | null
  emoji: string | undefined
  meta: { timezone: string }
}

export async function saveDiaryAction(form: SaveDiaryAction) {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

  const { date, content, imageUrl, emoji, meta } = form

  let uploadURL: string | null = null

  if (imageUrl) {
    const blob = await getDataURLToBlob(imageUrl)
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
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/diaries`, {
    method: 'POST',
    credentials: 'include',
    cache: 'no-store',
    next: { revalidate: 0 },
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify({
      date,
      content,
      imageUrl: uploadURL,
      emoji,
      meta,
    }),
  })

  return res.json()
}

export async function saveDiaryDraftAction(form: SaveDiaryAction) {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

  const { date, content, imageUrl, emoji, meta } = form

  let uploadURL: string | null = null

  if (imageUrl) {
    const blob = await getDataURLToBlob(imageUrl)
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
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/drafts`, {
    method: 'POST',
    credentials: 'include',
    cache: 'no-store',
    next: { revalidate: 0 },
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify({
      date,
      content,
      imageUrl: uploadURL,
      emoji,
      meta,
    }),
  })

  return res.json()
}
