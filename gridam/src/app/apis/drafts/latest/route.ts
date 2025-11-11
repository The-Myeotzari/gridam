import { fail, ok, withCORS } from '@/app/apis/_lib/http'
import getSupabaseServer from '@/utils/supabase/server'

export async function GET() {
  try {
    const supabase = await getSupabaseServer()
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser()
    if (authErr || !user) return withCORS(fail('UNAUTHORIZED', 401))

    const { data, error } = await supabase
      .from('diaries')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'draft')
      .is('deleted_at', null)
      .order('updated_at', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) {
      if (error.code === '42501') return withCORS(fail('FORBIDDEN', 403))
      return withCORS(fail('INTERNAL_ERROR', 500))
    }

    return withCORS(ok(data?.[0] ?? null))
  } catch {
    return withCORS(fail('INTERNAL_ERROR', 500))
  }
}

export { OPTIONS } from '@/app/apis/_lib/http'
