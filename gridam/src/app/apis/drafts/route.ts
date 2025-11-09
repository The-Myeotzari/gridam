import { fail, ok, withCORS } from '@/app/apis/_lib/http'
import { DraftCreateSchema } from '@/types/zod/apis/draft-schema'
import getSupabaseServer from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabaseServer()
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser()
    if (authErr || !user) return withCORS(fail('UNAUTHORIZED', 401))

    const json = await req.json().catch(() => ({}))
    const parsed = DraftCreateSchema.safeParse(json)
    if (!parsed.success) return withCORS(fail('Invalid payload', 422))

    const payload = {
      user_id: user.id,
      content: parsed.data.content,
      image_url: parsed.data.image ?? null,
      emoji: parsed.data.emoji ?? null,
      status: 'draft' as const,
      date: parsed.data.date,
    }

    const { data, error } = await supabase.from('diaries').insert(payload).select('*').single()

    if (error) {
      if (error.code === '42501') return withCORS(fail('FORBIDDEN', 403))
      return withCORS(fail('INTERNAL_ERROR', 500))
    }

    return withCORS(ok(data, 201))
  } catch (e) {
    return withCORS(fail('INTERNAL_ERROR', 500))
  }
}

export { OPTIONS } from '@/app/apis/_lib/http'
