// TODO: 에러 메시지 전체 검토 필요
import { fail, ok, withCORS } from '@/app/apis/_lib/http'
import { MESSAGES } from '@/shared/constants/messages'
import { DraftCreateSchema } from '@/shared/types/zod/apis/draft-schema'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { NextRequest } from 'next/server'
import { ZodError } from 'zod'

// 임시저장 목록 전체 조회
export async function GET() {
  try {
    const { supabase, user } = await getAuthenticatedUser()
    if (!user) throw new Error(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER)

    const { data, error } = await supabase
      .from('diaries')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'draft')
      .is('published_at', null)
      .is('deleted_at', null)
      .order('updated_at', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      return withCORS(fail(MESSAGES.DIARY.ERROR.DRAFT_READ, 500))
    }

    return withCORS(ok(data?.[0] ?? null))
  } catch (err) {
    if (err instanceof ZodError) {
      const firstIssue = err.issues[0]
      return fail(firstIssue.message, 400)
    }
    return withCORS(fail(MESSAGES.DIARY.ERROR.DRAFT_READ, 500))
  }
}

// 새 일기 처음 작성시 사용하는 임시 저장
export async function POST(req: NextRequest) {
  try {
    const { supabase, user } = await getAuthenticatedUser()
    if (!user) return withCORS(fail(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER, 401))
    const body = await req.json()

    const parsed = DraftCreateSchema.safeParse(body)
    if (!parsed.success) return withCORS(fail(MESSAGES.DIARY.ERROR.DRAFT_CREATE_NO_DATA, 500))

    const { content, date, emoji, imageUrl, meta } = parsed.data

    const { data: diary, error } = await supabase
      .from('diaries')
      .insert({
        user_id: user.id,
        content,
        date, // 제거 필요 - created_at과 동일
        image_url: imageUrl ?? null,
        emoji,
        status: 'draft' as const,
        published_at: null,
      })
      .select('id')
      .single()

    if (error) throw fail(MESSAGES.DIARY.ERROR.DRAFT_CREATE, 500)

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
    return withCORS(fail(MESSAGES.DIARY.ERROR.DRAFT_CREATE, 500))
  }
}

export { OPTIONS } from '@/app/apis/_lib/http'
