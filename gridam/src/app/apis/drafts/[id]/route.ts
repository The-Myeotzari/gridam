import { fail, ok, withCORS } from '@/app/apis/_lib/http'
import { Ctx } from '@/types/apis'
import { DraftUpdateSchema } from '@/types/zod/apis/draft-schema'
import getSupabaseServer from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const supabase = await getSupabaseServer()

    const { data: auth } = await supabase.auth.getUser()
    const user = auth.user
    if (!user) return withCORS(fail('Auth required', 401))

    const { data, error } = await supabase
      .from('diaries')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .eq('status', 'draft')
      .is('deleted_at', null)
      .single()

    if (error?.code === 'PGRST116') return withCORS(fail('Draft not found', 404))
    if (error) {
      console.error('[diaries select] error:', error) // ← code / message 확인
      return withCORS(fail('Query failed', 500))
    }
    return withCORS(ok(data))
  } catch {
    return withCORS(fail('Unexpected error', 500))
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const supabase = await getSupabaseServer()

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser()
    if (authErr || !user) return withCORS(fail('UNAUTHORIZED', 401))

    const json = await req.json().catch(() => ({}))
    const parsed = DraftUpdateSchema.safeParse(json)
    if (!parsed.success) return withCORS(fail('VALIDATION_ERROR', 422))

    const patch: Record<string, unknown> = {}
    if (parsed.data.content !== undefined) patch.content = parsed.data.content
    if (parsed.data.image !== undefined) patch.image_url = parsed.data.image
    if (parsed.data.emoji !== undefined) patch.emoji = parsed.data.emoji

    const { data, error } = await supabase
      .from('diaries')
      .update(patch)
      .eq('id', id)
      .eq('user_id', user.id)
      .eq('status', 'draft')
      .select('*')
      .single()

    if (error?.code === 'PGRST116') return withCORS(fail('NOT_FOUND', 404))
    if (error) {
      if (error.code === '42501') return withCORS(fail('FORBIDDEN', 403))
      return withCORS(fail('INTERNAL_ERROR', 500))
    }

    return withCORS(ok(data))
  } catch {
    return withCORS(fail('Unexpected error', 500))
  }
}

export { OPTIONS } from '@/app/apis/_lib/http'
