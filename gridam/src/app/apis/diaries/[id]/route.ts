// TODO: 에러 메시지 전체 검토 필요
import { fail, ok, withCORS } from '@/app/apis/_lib/http'
import { Params } from '@/types/params'
import { updateSchema } from '@/types/zod/apis/diaries'
import { getAuthenticatedUser } from '@/utils/get-authenticated-user'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const { supabase, user } = await getAuthenticatedUser()
    if (!user) return withCORS(fail('UNAUTHORIZED', 401))

    const { data, error } = await supabase
      .from('diaries')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    if (error) throw fail(error.message, 404)

    return withCORS(ok(data))
  } catch (err: unknown) {
    if (err instanceof Response) {
      return withCORS(err)
    }
    if (err instanceof Error) {
      return withCORS(fail(err.message, 500))
    }
    return withCORS(fail('Unknown error', 500))
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
    if (!user) return withCORS(fail('UNAUTHORIZED', 401))

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

    if (fetchErr) throw fail(fetchErr.message, 500)
    if (!existing) throw fail('Diary not found', 404)

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

    if (error) throw fail(error.message, 500)

    return withCORS(ok(data))
  } catch (err: unknown) {
    if (err instanceof NextResponse) {
      return withCORS(err)
    }
    if (err instanceof Error) {
      return withCORS(fail(err.message, 500))
    }
    return withCORS(fail('Unknown error', 500))
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { supabase, user } = await getAuthenticatedUser()
    if (!user) return withCORS(fail('UNAUTHORIZED', 401))

    const { id } = await params

    const { data: existing, error: fetchErr } = await supabase
      .from('diaries')
      .select('id, user_id, deleted_at')
      .eq('id', id)
      .single()

    if (fetchErr) throw fail(fetchErr.message, 500)
    if (!existing) throw fail('Diary not found', 404)
    if (existing.user_id !== user.id) throw fail('Forbidden', 403)
    if (existing.deleted_at) {
      // 이미 삭제됨
      return withCORS(ok(null, 204))
    }

    const { error } = await supabase
      .from('diaries')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .is('deleted_at', null)

    if (error) throw fail(error.message, 500)
    return withCORS(ok(null, 204))
  } catch (err: unknown) {
    if (err instanceof NextResponse) {
      return withCORS(err)
    }
    if (err instanceof Error) {
      return withCORS(fail(err.message, 500))
    }
    return withCORS(fail('Unknown error', 500))
  }
}

export { OPTIONS } from '@/app/apis/_lib/http'
