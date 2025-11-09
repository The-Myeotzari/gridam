import { fail, ok, withCORS } from '@/app/apis/_lib/http'
import { createSchema, querySchema } from '@/types/zod/apis/diaries'
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const { supabase, user } = await getAuthenticatedUser()

    const parsed = querySchema.safeParse(Object.fromEntries(searchParams))
    const status = parsed.success ? parsed.data.status : undefined

    let query = supabase
      .from('diaries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) throw fail(error.message, 500)

    return withCORS(ok(data))
  } catch (err: any) {
    return withCORS(err instanceof Response ? err : fail(err.message, 500))
  }
}

export async function POST(req: NextRequest) {
  try {
    const { supabase, user } = await getAuthenticatedUser()
    const body = await req.json()

    const parsed = createSchema.safeParse(body)
    if (!parsed.success) throw fail(parsed.error.message, 422)

    const { content, date, emoji, imageUrl, meta } = parsed.data

    // 1) Create diary
    const { data: diary, error } = await supabase
      .from('diaries')
      .insert({
        user_id: user.id,
        content,
        date,
        emoji,
        image_url: imageUrl ?? null,
        status: 'draft',
      })
      .select('id')
      .single()

    if (error) throw fail(error.message, 500)

    // 2) Optional metadata
    if (meta) {
      const { error: metaErr } = await supabase.from('metadata').insert({
        diary_id: diary.id,
        date,
        timezone: meta.timezone,
        weather: meta.weather ?? null,
      })
      if (metaErr) throw fail(metaErr.message, 500)
    }

    return withCORS(ok({ id: diary.id }, 201))
  } catch (err: any) {
    return withCORS(err instanceof Response ? err : fail(err.message, 500))
  }
}

export { OPTIONS } from '@/app/apis/_lib/http'
