'use server'

import { MESSAGES } from '@/shared/constants/messages'
import { createSchema } from '@/shared/types/zod/apis/diaries'
import { DraftCreateSchema } from '@/shared/types/zod/apis/draft-schema'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { uploadDiaryImage } from '@/shared/utils/uploads/upload-diary-image'

export async function saveDiaryAction(form: {
  date: string
  content: string
  imageUrl: string | null
  emoji: string | undefined
  meta: { timezone: string }
}) {
  const { supabase, user } = await getAuthenticatedUser()
  if (!user) throw new Error(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER)

  const parsed = createSchema.safeParse(form)
  if (!parsed.success) throw new Error(MESSAGES.DIARY.ERROR.CREATE_NO_DATA)

  const { date, content, emoji, imageUrl, meta } = parsed.data

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
      date,
      emoji,
      image_url: uploadedUrl,
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (error) throw new Error(MESSAGES.DIARY.ERROR.CREATE)

  if (meta) {
    await supabase.from('metadata').insert({
      diary_id: diary.id,
      date,
      timezone: meta.timezone,
    })
  }

  return { ok: true, id: diary.id }
}

export async function saveDiaryDraftAction(payload: {
  date: string
  content: string
  imageUrl: string | null
  emoji?: string
  meta?: any
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
