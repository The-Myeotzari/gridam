'use server'

import { MESSAGES } from '@/shared/constants/messages'
import getSupabaseServer from '@/shared/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function fetchDraftAction() {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/drafts`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    next: { revalidate: 0 },
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
  })

  return res.json()
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
