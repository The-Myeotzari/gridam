'use server'

import { saveImageAction } from '@/features/diary/image.action'
import { getCookies } from '@/shared/utils/get-cookies'

type SaveDiaryAction = {
  date: string
  content: string
  imageUrl: string | null
  emoji: string | undefined
  meta: { timezone: string }
  type: 'diaries' | 'drafts'
}

export async function saveDiaryAction(form: SaveDiaryAction) {
  const cookieHeader = await getCookies()

  const { date, content, imageUrl, emoji, meta, type } = form

  let uploadURL: string | null = null
  if (imageUrl) {
    uploadURL = await saveImageAction({ imageUrl, cookieHeader })
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${type}`, {
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
