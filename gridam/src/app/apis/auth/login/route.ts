import { fail, ok } from '@/app/apis/_lib/http'
import getSupabaseServer from '@/utils/supabase/server'
import { z } from 'zod'

const querySchema = z.object({
  status: z.enum(['draft', 'published']).optional(),
})

export async function GET(req: Request) {
  const supabase = await getSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return fail('Unauthorized', 401)

  const { searchParams } = new URL(req.url)
  const parsed = querySchema.safeParse(Object.fromEntries(searchParams))
  const status = parsed.success ? parsed.data.status : undefined

  let q = supabase
    .from('diaries')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (status) q = q.eq('status', status)

  const { data, error } = await q
  if (error) return fail(error.message, 500)
  return ok(data)
}
