'use server'

import { MESSAGES } from '@/shared/constants/messages'
import { createSchema, updateSchema } from '@/shared/types/zod/apis/diaries'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { uploadDiaryImage } from '@/shared/utils/supabase/upload-diary-image'

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

  // 3) 저장
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

  // 4) 메타데이터 저장
  if (meta) {
    await supabase.from('metadata').insert({
      diary_id: diary.id,
      date,
      timezone: meta.timezone,
    })
  }

  return { ok: true, id: diary.id }
}

type DiaryPatch = {
  content?: string
  image_url?: string | null
  published_at?: string | null
}

export async function updateDiaryAction(form: {
  id: string
  content: string
  imageUrl: string | null
}) {
  const parsed = updateSchema.safeParse(form)
  if (!parsed.success) throw new Error(MESSAGES.DIARY.ERROR.CREATE_NO_DATA)

  const { id, content, imageUrl } = parsed.data

  const { supabase, user } = await getAuthenticatedUser()
  if (!user) throw new Error(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER)

  let uploadedUrl: string | null = null
  if (imageUrl) {
    const { url } = await uploadDiaryImage(imageUrl, user.id)
    uploadedUrl = url
  }

  const { data: existing, error: fetchErr } = await supabase
    .from('diaries')
    .select('status, published_at')
    .eq('id', id)
    .single()

  if (fetchErr || !existing) {
    throw new Error(MESSAGES.DIARY.ERROR.READ)
  }

  const patch: DiaryPatch = {
    ...(content !== undefined && { content }),
    image_url: uploadedUrl ?? null,
  }

  if (existing.status === 'published') {
    patch.published_at = existing.published_at
  }

  const { data, error } = await supabase
    .from('diaries')
    .update(patch)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .single()

  if (error) throw new Error(MESSAGES.DIARY.ERROR.UPDATE)

  return { ok: true, data }
}
