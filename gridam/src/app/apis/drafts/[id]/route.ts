import { fail, ok, withCORS } from '@/app/apis/_lib/http'
import { Ctx } from '@/types/apis'
import getSupabaseServer from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const supabase = await getSupabaseServer()

    const { data: auth } = await supabase.auth.getUser()
    const user = auth.user
    if (!user) return withCORS(fail('Auth required', 401))

    const { data, error } = await supabase
      .from('diaries')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .eq('status', 'draft')
      .is('deleted_at', null)
      .single()

    if (error?.code === 'PGRST116') return withCORS(fail('Draft not found', 404))
    if (error) {
      console.error('[diaries select] error:', error) // ← code / message 확인
      return withCORS(fail('Query failed', 500))
    }
    return withCORS(ok(data))
  } catch {
    return withCORS(fail('Unexpected error', 500))
  }
}

export { OPTIONS } from '@/app/apis/_lib/http'
