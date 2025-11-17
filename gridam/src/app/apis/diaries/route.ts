import { fail, ok, withCORS } from '@/app/apis/_lib/http'
import { getDiaryServer } from '@/features/feed/api/get-diary.server'
import { createSchema } from '@/types/zod/apis/diaries'
import { getAuthenticatedUser } from '@/utils/get-authenticated-user'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  return Response.json(
    await getDiaryServer({
      year: searchParams.get('year')!,
      month: searchParams.get('month')!,
      cursor: searchParams.get('cursor'),
    })
  )
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

    if (meta) {
      const { error: metaErr } = await supabase.from('metadata').insert({
        diary_id: diary.id,
        date,
        timezone: meta.timezone, // 시간대
      })
      if (metaErr) throw fail(metaErr.message, 500)
    }

    return withCORS(ok({ id: diary.id }, 201))
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
