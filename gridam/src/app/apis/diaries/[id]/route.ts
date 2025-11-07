import { fail, ok } from '@/app/apis/_lib/http'
import getSupabaseServer from '@/utils/supabase/server'
import { z } from 'zod'

type DiaryPatch = {
  content?: string;
  emoji?: string;
  image_url?: string | null;
  status?: 'draft' | 'published';
  published_at?: string | null;
}

const updateSchema = z.object({
  content: z.string().min(1).max(200).optional(),
  emoji: z.string().optional(),
  imageUrl: z.string().url().nullable().optional(),
  status: z.enum(['draft', 'published']).optional(),
})

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const supabase = await getSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return fail('Unauthorized', 401)

  const { data, error } = await supabase.from('diaries').select('*').eq('id', params.id).single()
  if (error) return fail(error.message, 404)
  return ok(data)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const supabase = await getSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return fail('Unauthorized', 401)

  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return fail(parsed.error.message, 422)

  const patch: DiaryPatch = {}
  if (parsed.data.content !== undefined) patch.content = parsed.data.content
  if (parsed.data.emoji !== undefined) patch.emoji = parsed.data.emoji
  if (parsed.data.imageUrl !== undefined) patch.image_url = parsed.data.imageUrl
  if (parsed.data.status === 'published') {
    patch.status = 'published'
    patch.published_at = new Date().toISOString()
  } else if (parsed.data.status === 'draft') {
    patch.status = 'draft'
    patch.published_at = null
  }

  const { error } = await supabase.from('diaries').update(patch).eq('id', params.id)
  if (error) return fail(error.message, 500)
  return ok(null)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const supabase = await getSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return fail('Unauthorized', 401)

  // 소프트 삭제를 원하면 update로 바꾸세요.
  const { error } = await supabase.from('diaries').delete().eq('id', params.id)
  if (error) return fail(error.message, 500)
  return ok(null, 204)
}

export { OPTIONS } from '@/app/apis/_lib/http'
