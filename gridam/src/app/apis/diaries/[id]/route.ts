import { fail, ok, withCORS } from '@/app/apis/_lib/http'
import { Params } from '@/types/params'
import { updateSchema } from '@/types/zod/apis/diaries'
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'
import { NextRequest, NextResponse } from 'next/server'

type DiaryPatch = {
  content?: string
  emoji?: string
  image_url?: string | null
  status?: 'draft' | 'published'
  published_at?: string | null
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const { supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase.from('diaries').select('*').eq('id', id).single()
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

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { supabase } = await getAuthenticatedUser()
    const { id } = await params
    const body = await req.json()

    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) throw fail(parsed.error.message, 422)

    const { content, emoji, imageUrl, status } = parsed.data
    const patch: DiaryPatch = {
      ...(content !== undefined && { content }),
      ...(emoji !== undefined && { emoji }),
      ...(imageUrl !== undefined && { image_url: imageUrl }),
    }

    if (status) {
      patch.status = status
      patch.published_at = status === 'published' ? new Date().toISOString() : null
    }

    const { error } = await supabase.from('diaries').update(patch).eq('id', id)
    if (error) throw fail(error.message, 500)

    return withCORS(ok(null))
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
    const { supabase } = await getAuthenticatedUser()
    const { id } = await params

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
