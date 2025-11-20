'use server'

import { MESSAGES } from '@/shared/constants/messages'
import { updateSchema } from '@/shared/types/zod/apis/diaries'
import { DraftUpdateSchema } from '@/shared/types/zod/apis/draft-schema'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { withSignedImageUrls } from '@/shared/utils/supabase/with-signed-image-urls'
import { uploadDiaryImage } from '@/shared/utils/uploads/upload-diary-image'

export async function getDiary(id: string) {
  const { supabase, user } = await getAuthenticatedUser()
  if (!user) throw new Error(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER)

  const query = supabase.from('diaries').select('*').eq('id', id).single()
  const { data, error } = await query

  if (error) throw new Error(MESSAGES.DIARY.ERROR.READ)
  if (data?.image_url) {
    const signed = await withSignedImageUrls(await supabase, [data])
    return signed[0]
  }

  return data
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
  const { supabase, user } = await getAuthenticatedUser()
  if (!user) throw new Error(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER)

  const parsed = updateSchema.safeParse(form)
  if (!parsed.success) throw new Error(MESSAGES.DIARY.ERROR.CREATE_NO_DATA)

  const { id, content, imageUrl } = parsed.data

  let uploadedUrl: string | null = null
  if (imageUrl && imageUrl.startsWith('data:image')) {
    const { url } = await uploadDiaryImage(imageUrl, user.id)
    uploadedUrl = url
  } else {
    uploadedUrl = imageUrl ?? null
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

export async function updateDiaryDraftAction(payload: {
  id: string
  content: string
  imageUrl: string | null
}) {
  try {
    const { supabase, user } = await getAuthenticatedUser()
    if (!user) throw new Error(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER)

    const parsed = DraftUpdateSchema.safeParse(payload)
    if (!parsed.success) throw new Error(MESSAGES.DIARY.ERROR.DRAFT_UPDATE_NO_DATA)

    const { id, content, imageUrl } = parsed.data

    let uploadedUrl: string | null = null
    if (imageUrl && imageUrl.startsWith('data:image')) {
      const { url } = await uploadDiaryImage(imageUrl, user.id)
      uploadedUrl = url
    } else {
      uploadedUrl = imageUrl ?? null
    }

    const patch: DiaryPatch = {
      ...(content !== undefined && { content }),
      image_url: uploadedUrl ?? null,
    }

    const { data, error } = await supabase
      .from('diaries')
      .update(patch)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .single()

    if (error) throw new Error(MESSAGES.DIARY.ERROR.DRAFT_UPDATE)

    return { ok: true, data: data }
  } catch (err) {
    return { ok: false }
  }
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
