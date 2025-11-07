import { fail, ok } from '@/app/apis/_lib/http'
import getSupabaseServer from '@/utils/supabase/server'
import { z } from 'zod'

const schema = z.object({
  date: z.string(), // YYYY-MM-DD
  timezone: z.string(),
  weather: z.any().nullable().optional(),
})

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await getSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return fail('Unauthorized', 401)

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return fail(parsed.error.message, 422)
  const { id } = await params
  const { error } = await supabase.from('metadata').upsert({
    diary_id: id,
    date: parsed.data.date,
    timezone: parsed.data.timezone,
    weather: parsed.data.weather ?? null,
  })
  if (error) return fail(error.message, 500)
  return ok(null)
}

export { OPTIONS } from '@/app/apis/_lib/http'
