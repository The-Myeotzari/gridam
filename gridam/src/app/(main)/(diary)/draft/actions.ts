'use server'

import { MESSAGES } from '@/shared/constants/messages'
import { DraftCreateSchema } from '@/shared/types/zod/apis/draft-schema'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import getSupabaseServer from '@/shared/utils/supabase/server'
import { revalidatePath } from 'next/cache'

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

    const { data: diary, error } = await supabase
      .from('diaries')
      .insert({
        user_id: user.id,
        content,
        date, // 제거 필요 - created_at과 동일
        image_url: imageUrl ?? null,
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

export async function deleteDraftAction(id: string) {
  try {
    const supabase = await getSupabaseServer()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER)
    }

    // 삭제 여부 확인
    const { data: existing } = await supabase
      .from('diaries')
      .select('deleted_at')
      .eq('id', id)
      .single()

    if (!existing) {
      throw new Error(MESSAGES.DIARY.ERROR.DRAFT_READ)
    }

    if (existing.deleted_at) {
      return true
    }

    // soft delete
    const { error } = await supabase
      .from('diaries')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .is('deleted_at', null)

    if (error) {
      throw new Error(MESSAGES.DIARY.ERROR.DRAFT_DELETE)
    }

    revalidatePath('/draft')

    return true
  } catch (err) {
    console.error(MESSAGES.DIARY.ERROR.DRAFT_DELETE, err)
    throw MESSAGES.DIARY.ERROR.DRAFT_DELETE
  }
}
