// TODO: 에러 메시지 전체 검토 필요
import { fail, ok } from '@/app/apis/_lib/http'
import { MESSAGES } from '@/shared/constants/messages'
import { Params } from '@/shared/types/params'
import { DraftUpdateSchema } from '@/shared/types/zod/apis/draft-schema'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { NextRequest } from 'next/server'
import { ZodError } from 'zod'

// 임시 저장 발생
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { supabase, user } = await getAuthenticatedUser()
    if (!user) return fail(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER, 401)

    const { id } = await params

    const body = await req.json()
    const parsed = DraftUpdateSchema.safeParse(body)
    if (!parsed.success) return fail(MESSAGES.DIARY.ERROR.DRAFT_CREATE_NO_DATA, 400)

    const { content, imageUrl } = parsed.data

    const { data: existing, error: fetchErr } = await supabase
      .from('diaries')
      .select('status')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchErr || !existing) {
      return fail(MESSAGES.DIARY.ERROR.READ, 404)
    }

    const { data, error } = await supabase
      .from('diaries')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        content,
        image_url: imageUrl,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .select('id,status,published_at,date')
      .single()

    if (error) return fail(MESSAGES.DIARY.ERROR.DRAFT_SAVE, 500)

    return ok(data, 200)
  } catch (err) {
    if (err instanceof ZodError) {
      const firstIssue = err.issues[0]
      return fail(firstIssue.message, 400)
    }
    return fail(MESSAGES.DIARY.ERROR.DRAFT_CREATE, 500)
  }
}

export { OPTIONS } from '@/app/apis/_lib/http'
