'use server'

import { MESSAGES } from '@/shared/constants/messages'
import getSupabaseServer from '@/shared/utils/supabase/server'
import { revalidatePath } from 'next/cache'

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
