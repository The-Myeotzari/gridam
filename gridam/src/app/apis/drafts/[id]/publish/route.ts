// TODO: 에러 메시지 전체 검토 필요
import { fail, ok, withCORS } from '@/app/apis/_lib/http'
import { Params } from '@/types/params'
import { getAuthenticatedUser } from '@/utils/get-authenticated-user'
import { NextRequest } from 'next/server'

// 임시 저장 발생
export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const { supabase, user } = await getAuthenticatedUser()
    if (!user) return withCORS(fail('UNAUTHORIZED', 401))

    const { id } = await params

    const { data, error } = await supabase
      .from('diaries')
      .update({ status: 'published', published_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .select('id,status,published_at,date')
      .single()

    if (error) throw fail(error.message, 500)
    return withCORS(ok(data))
  } catch {
    return withCORS(fail('Unexpected error', 500))
  }
}

export { OPTIONS } from '@/app/apis/_lib/http'
