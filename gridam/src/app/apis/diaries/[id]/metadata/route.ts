import { fail, ok, withCORS } from '@/app/apis/_lib/http'
import { Params } from '@/types/params'
import { putSchema } from '@/types/zod/apis/diaries'
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'
import { NextRequest } from 'next/server'

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { supabase } = await getAuthenticatedUser()
    const { id } = await params

    const body = await req.json()
    const parsed = putSchema.safeParse(body)
    if (!parsed.success) throw fail(parsed.error.message, 422)

    const { date, timezone, weather } = parsed.data

    const { error } = await supabase.from('metadata').upsert({
      diary_id: id,
      date,
      timezone,
      weather: weather ?? null,
    })

    if (error) throw fail(error.message, 500)
    return withCORS(ok(null))
  } catch (err: any) {
    return withCORS(err instanceof Response ? err : fail(err.message, 500))
  }
}

export { OPTIONS } from '@/app/apis/_lib/http'
