// TODO: 에러 메시지 전체 검토 필요
import { fail, ok, withCORS } from '@/app/apis/_lib/http'
import { MESSAGES } from '@/constants/messages'
import { Params } from '@/types/params'
import { DraftUpdateSchema } from '@/types/zod/apis/draft-schema'
import { getAuthenticatedUser } from '@/utils/get-authenticated-user'
import { NextRequest } from 'next/server'
import { ZodError } from 'zod'

// 임시저장 글 1개 조회
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
      .eq('status', 'draft')
      .is('deleted_at', null)
      .single()
    if (error) throw fail(MESSAGES.DIARY.ERROR.DRAFT_READ, 500)

    return withCORS(ok(data))
  } catch (err) {
    if (err instanceof ZodError) {
      const firstIssue = err.issues[0]
      return fail(firstIssue.message, 400)
    }
    return withCORS(fail(MESSAGES.DIARY.ERROR.DRAFT_READ, 500))
  }
}

// 임시저장한 내용 수정 - 발행 안된 게시글 기준으로만 가능
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { supabase, user } = await getAuthenticatedUser()
    if (!user) return withCORS(fail(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER, 401))

    const { id } = await params
    const body = await req.json()

    const parsed = DraftUpdateSchema.safeParse(body)
    if (!parsed.success) throw fail(MESSAGES.DIARY.ERROR.DRAFT_UPDATE_NO_DATA, 500)

    const { content, imageUrl } = parsed.data

    const patch = {
      ...(content !== undefined && { content }),
      ...(imageUrl !== undefined && { image_url: imageUrl }),
    }

    const { data, error } = await supabase
      .from('diaries')
      .update(patch)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .single()

    if (error) throw fail(MESSAGES.DIARY.ERROR.DRAFT_UPDATE, 500)

    return withCORS(ok(data))
  } catch (err) {
    if (err instanceof ZodError) {
      const firstIssue = err.issues[0]
      return fail(firstIssue.message, 400)
    }
    return withCORS(fail(MESSAGES.DIARY.ERROR.DRAFT_UPDATE, 500))
  }
}

// 임시저장 삭제
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

    if (fetchErr) throw fail(MESSAGES.DIARY.ERROR.DRAFT_READ, 500)
    if (!existing) throw fail(MESSAGES.DIARY.ERROR.DRAFT_READ, 500)
    if (existing.deleted_at) {
      // 이미 삭제됨
      return withCORS(ok(MESSAGES.DIARY.ERROR.DRAFT_DELETE_OVER, 204))
    }

    const { error } = await supabase
      .from('diaries')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .is('deleted_at', null)

    if (error) throw fail(MESSAGES.DIARY.ERROR.DRAFT_DELETE, 500)
    return withCORS(ok(null, 204))
  } catch (err) {
    if (err instanceof ZodError) {
      const firstIssue = err.issues[0]
      return fail(firstIssue.message, 400)
    }
    return withCORS(fail(MESSAGES.DIARY.ERROR.DRAFT_DELETE, 500))
  }
}

export { OPTIONS } from '@/app/apis/_lib/http'
