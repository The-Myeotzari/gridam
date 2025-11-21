// TODO: 에러 메시지 전체 검토 필요

import { fail, ok, withCORS } from '@/app/apis/_lib/http'
import { MESSAGES } from '@/shared/constants/messages'
import { Params } from '@/shared/types/params'
import { DraftUpdateSchema } from '@/shared/types/zod/apis/draft-schema'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { NextRequest } from 'next/server'
import { ZodError } from 'zod'

// 임시저장 글 1개 조회
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const { supabase, user } = await getAuthenticatedUser()

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

    const { id } = await params
    const body = await req.json()

    const parsed = DraftUpdateSchema.safeParse(body)
    if (!parsed.success) return fail(MESSAGES.DIARY.ERROR.DRAFT_UPDATE_NO_DATA, 500)

    const { content, imageUrl } = parsed.data

    const { data: existing, error: fetchErr } = await supabase
      .from('diaries')
      .select('status')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchErr || !existing) {
      return fail(MESSAGES.DIARY.ERROR.READ, 404)
    }

    const { data, error } = await supabase
      .from('diaries')
      .update({
        content,
        image_url: imageUrl,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .single()

    if (error) return fail(MESSAGES.DIARY.ERROR.DRAFT_UPDATE, 500)

    return ok(data, 200)
  } catch (err) {
    if (err instanceof ZodError) {
      const firstIssue = err.issues[0]
      return fail(firstIssue.message, 400)
    }
    return fail(MESSAGES.DIARY.ERROR.DRAFT_UPDATE, 500)
  }
}

// 임시저장 삭제
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { supabase, user } = await getAuthenticatedUser()

    const { id } = await params

    // 삭제 여부 확인
    const { data: existing } = await supabase
      .from('diaries')
      .select('deleted_at')
      .eq('id', id)
      .single()

    if (!existing) {
      return fail(MESSAGES.DIARY.ERROR.DRAFT_READ, 500)
    }

    if (existing.deleted_at) {
      return ok(MESSAGES.DIARY.ERROR.DELETE_OVER, 200)
    }

    // soft delete
    const { error } = await supabase
      .from('diaries')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .is('deleted_at', null)

    if (error) {
      return fail(MESSAGES.DIARY.ERROR.DRAFT_DELETE, 400)
    }

    return ok(MESSAGES.DIARY.SUCCESS.DELETE, 200)
  } catch (err) {
    return fail(MESSAGES.DIARY.ERROR.DRAFT_DELETE, 500)
  }
}

export { OPTIONS } from '@/app/apis/_lib/http'
