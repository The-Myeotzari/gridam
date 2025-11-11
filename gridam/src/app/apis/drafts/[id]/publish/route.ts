import { fail, ok, withCORS } from '@/app/apis/_lib/http'
import { Params } from '@/types/params'
import getSupabaseServer from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await getSupabaseServer()

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser()
    if (authErr || !user) return withCORS(fail('UNAUTHORIZED', 401))

    const { data, error } = await supabase
      .from('diaries')
      .update({ status: 'published', published_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .select('id,status,published_at,date')
      .single()

    if (error?.code === 'PGRST116') return withCORS(fail('Draft not found', 404))
    if (error && /duplicate key value|unique/i.test(error.message)) {
      return withCORS(fail('You already published a diary for this date.', 409))
    }
    if (error) return withCORS(fail('Failed to publish', 500))

    return withCORS(ok(data))
  } catch {
    return withCORS(fail('Unexpected error', 500))
  }
}

export { OPTIONS } from '@/app/apis/_lib/http'
