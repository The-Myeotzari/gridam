'use server'

import { MESSAGES } from '@/shared/constants/messages'
import { DraftCreateSchema } from '@/shared/types/zod/apis/draft-schema'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { getBlobToFile, getDataURLToBlob } from '@/shared/utils/get-data-url-to-blob'
import { uploadDiaryImage } from '@/shared/utils/uploads/upload-diary-image'
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

export async function saveDiaryDraftAction(payload: {
  date: string
  content: string
  imageUrl: string | null
  emoji?: string
  meta?: { timezone: string }
}) {
  try {
    const { supabase, user } = await getAuthenticatedUser()
    if (!user) throw new Error(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER)

    const parsed = DraftCreateSchema.safeParse(payload)
    if (!parsed.success) throw new Error(MESSAGES.DIARY.ERROR.DRAFT_CREATE_NO_DATA)

    const { content, date, emoji, imageUrl, meta } = parsed.data

    let uploadedUrl: string | null = null

    if (imageUrl) {
      const { url } = await uploadDiaryImage(imageUrl, user.id)
      uploadedUrl = url
    }

    const start = new Date(`${date}T00:00:00.000Z`).toISOString()
    const end = new Date(`${date}T23:59:59.999Z`).toISOString()

    const { data: exist, error: existErr } = await supabase
      .from('diaries')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', start)
      .lte('created_at', end)
      .is('deleted_at', null)
      .maybeSingle()

    if (existErr) throw new Error(MESSAGES.DIARY.ERROR.READ)
    if (exist) throw new Error(MESSAGES.DIARY.ERROR.CREATE_OVER)

    const { data: diary, error } = await supabase
      .from('diaries')
      .insert({
        user_id: user.id,
        content,
        date, // 제거 필요 - created_at과 동일
        image_url: uploadedUrl,
        emoji,
        status: 'draft' as const,
        published_at: null,
      })
      .select('id')
      .single()

    if (error) throw new Error(MESSAGES.DIARY.ERROR.DRAFT_CREATE)

    if (meta) {
      const { error: metaErr } = await supabase.from('metadata').insert({
        diary_id: diary.id,
        date, // 제거 필요 - created_at과 동일
        timezone: meta.timezone, // 시간대
      })
      if (metaErr) throw new Error(MESSAGES.DIARY.ERROR.META)
    }

    return { ok: true, data: { id: diary.id } }
  } catch (err) {
    return { ok: false }
  }
}
