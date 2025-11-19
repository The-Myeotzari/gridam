// TODO: 에러 메시지 전체 검토 필요
import { fail, ok, withCORS } from '@/app/apis/_lib/http'
import { getDiaryServer } from '@/features/feed/api/get-diary.server'
import { MESSAGES } from '@/shared/constants/messages'
import { createSchema } from '@/shared/types/zod/apis/diaries'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { NextRequest } from 'next/server'
import { ZodError } from 'zod'

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
    if (!user) return withCORS(fail(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER, 401))
    const body = await req.json()

    const parsed = createSchema.safeParse(body)
    if (!parsed.success) throw fail(MESSAGES.DIARY.ERROR.CREATE_NO_DATA, 422)

    const { content, date, emoji, imageUrl, meta } = parsed.data

    // 중복체크
    const start = new Date(`${date}T00:00:00.000Z`).toISOString()
    const end = new Date(`${date}T23:59:59.999Z`).toISOString()

    const { data: existingDiary, error: existingError } = await supabase
      .from('diaries')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', start)
      .lte('created_at', end)
      .is('deleted_at', null)
      .maybeSingle()

    if (existingError) {
      throw fail(MESSAGES.DIARY.ERROR.READ, 500)
    }
    if (existingDiary) {
      return withCORS(fail(MESSAGES.DIARY.ERROR.CREATE_OVER, 409))
    }

    const { data: diary, error } = await supabase
      .from('diaries')
      .insert({
        user_id: user.id,
        content,
        date, // 제거 필요 - created_at과 동일
        emoji,
        image_url: imageUrl ?? null,
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (error) throw fail(MESSAGES.DIARY.ERROR.CREATE, 500)

    if (meta) {
      const { error: metaErr } = await supabase.from('metadata').insert({
        diary_id: diary.id,
        date, // 제거 필요 - created_at과 동일
        timezone: meta.timezone, // 시간대
      })
      if (metaErr) throw fail(MESSAGES.DIARY.ERROR.META, 500)
    }

    return withCORS(ok({ id: diary.id }, 201))
  } catch (err) {
    if (err instanceof ZodError) {
      const firstIssue = err.issues[0]
      return fail(firstIssue.message, 400)
    }
    return withCORS(fail(MESSAGES.DIARY.ERROR.CREATE, 500))
  }
}

export { OPTIONS } from '@/app/apis/_lib/http'
