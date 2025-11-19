// TODO: 에러 메시지 전체 검토 필요
import { fail, ok, withCORS } from '@/app/apis/_lib/http'
import { MESSAGES } from '@/constants/messages'
import { Params } from '@/types/params'
import { updateSchema } from '@/types/zod/apis/diaries'
import { getAuthenticatedUser } from '@/utils/get-authenticated-user'
import { NextRequest } from 'next/server'
import { ZodError } from 'zod'

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const { supabase, user } = await getAuthenticatedUser()
    if (!user) return withCORS(fail(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER, 401))

    const { data, error } = await supabase
      .from('diaries')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    if (error) throw fail(MESSAGES.DIARY.ERROR.READ, 505)

    return withCORS(ok(data))
  } catch (err) {
    if (err instanceof ZodError) {
      const firstIssue = err.issues[0]
      return fail(firstIssue.message, 400)
    }
    return withCORS(fail(MESSAGES.DIARY.ERROR.READ, 500))
  }
}

type DiaryPatch = {
  content?: string
  image_url?: string | null
  published_at?: string | null
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { supabase, user } = await getAuthenticatedUser()
    if (!user) return withCORS(fail(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER, 401))

    const { id } = await params
    const body = await req.json()

    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) throw fail(parsed.error.message, 422)

    const { content, imageUrl } = parsed.data

    const { data: existing, error: fetchErr } = await supabase
      .from('diaries')
      .select('status, published_at')
      .eq('id', id)
      .single()

    if (fetchErr) throw fail(MESSAGES.DIARY.ERROR.READ, 500)
    if (!existing) throw fail(MESSAGES.DIARY.ERROR.READ_NO, 500)

    const patch: DiaryPatch = {
      ...(content !== undefined && { content }),
      ...(imageUrl !== undefined && { image_url: imageUrl }),
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

    if (error) throw fail(MESSAGES.DIARY.ERROR.UPDATE, 500)

    return withCORS(ok(data))
  } catch (err) {
    if (err instanceof ZodError) {
      const firstIssue = err.issues[0]
      return fail(firstIssue.message, 400)
    }
    return withCORS(fail(MESSAGES.DIARY.ERROR.UPDATE, 500))
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { supabase, user } = await getAuthenticatedUser()
    if (!user) return withCORS(fail(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER, 401))

    const { id } = await params

    const { data: existing, error: fetchErr } = await supabase
      .from('diaries')
      .select('id, user_id, deleted_at')
      .eq('id', id)
      .single()

    if (fetchErr) throw fail(MESSAGES.DIARY.ERROR.READ, 500)
    if (!existing) throw fail(MESSAGES.DIARY.ERROR.READ_NO, 500)
    if (existing.deleted_at) {
      // 이미 삭제됨
      return withCORS(ok(MESSAGES.DIARY.ERROR.DELETE_OVER, 204))
    }

    const { error } = await supabase
      .from('diaries')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .is('deleted_at', null)

    if (error) throw fail(MESSAGES.DIARY.ERROR.DELETE, 500)
    return withCORS(ok(null, 204))
  } catch (err) {
    if (err instanceof ZodError) {
      const firstIssue = err.issues[0]
      return fail(firstIssue.message, 400)
    }
    return withCORS(fail(MESSAGES.DIARY.ERROR.DELETE, 500))
  }
}

export { OPTIONS } from '@/app/apis/_lib/http'
