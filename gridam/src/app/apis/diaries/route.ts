import { fail, ok, withCORS } from '@/app/apis/_lib/http'
import { createSchema, querySchema } from '@/types/zod/apis/diaries'
import { getAuthenticatedUser } from '@/utils/get-authenticated-user'
import { withSignedImageUrls } from '@/utils/supabase/with-signed-image-urls'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const { supabase, user } = await getAuthenticatedUser()
    if (!user) {
      return withCORS(fail('로그인이 필요합니다.', 401))
    }

    const parsed = querySchema.safeParse(Object.fromEntries(searchParams))
    const status = parsed.success ? parsed.data.status : undefined
    const year = parsed.success ? parsed.data.year : undefined
    const month = parsed.success ? parsed.data.month : undefined

    let query = supabase.from('diaries').select('*').eq('user_id', user.id)

    if (status) query = query.eq('status', status)

    if (year && month) {
      const startDate = new Date(Number(year), Number(month) - 1, 1).toISOString()
      const endDate = new Date(Number(year), Number(month), 1).toISOString()

      query = query.gte('created_at', startDate).lt('created_at', endDate)
    }

    query = query.order('created_at', { ascending: false })

    const { data: diaries, error } = await query
    if (error) throw fail(error.message, 500)
    if (!diaries) return withCORS(ok([]))

    const diariesWithSignedUrls = await withSignedImageUrls(supabase, diaries)

    return withCORS(ok(diariesWithSignedUrls))
  } catch (err: unknown) {
    if (err instanceof NextResponse) return withCORS(err)
    if (err instanceof Error) return withCORS(fail(err.message, 500))
    return withCORS(fail('Unknown error', 500))
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
