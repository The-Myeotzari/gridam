import { fail, ok } from '@/app/apis/_lib/http'
import useSupabaseServer from '@/utils/supabase/server'
import { z } from 'zod'

const createSchema = z.object({
  content: z.string().min(1).max(200),
  date: z.string(), // 'YYYY-MM-DD'
  emoji: z.string().optional(),
  imageUrl: z.string().url().optional(),
  meta: z
    .object({
      timezone: z.string(),
      weather: z.any().optional(),
    })
    .optional(),
})

const querySchema = z.object({
  status: z.enum(['draft', 'published']).optional(),
})

/**
 * @openapi
 * /api/diaries:
 *   get:
 *     summary: diaries get
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 객체..
 */
export async function GET(req: Request) {
  const supabase = await useSupabaseServer()
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

export async function POST(req: Request) {
  const supabase = await useSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return fail('Unauthorized', 401)

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return fail(parsed.error.message, 422)
  const { content, date, emoji, imageUrl, meta } = parsed.data

  // 1) diaries
  const { data: diary, error } = await supabase
    .from('diaries')
    .insert({
      user_id: user.id,
      content,
      date,
      emoji,
      image_url: imageUrl ?? null,
      status: 'draft',
    })
    .select('id')
    .single()
  if (error) return fail(error.message, 500)

  // 2) metadata (optional)
  if (meta) {
    const { error: mErr } = await supabase.from('metadata').insert({
      diary_id: diary.id,
      date,
      timezone: meta.timezone,
      weather: meta.weather ?? null,
    })
    if (mErr) return fail(mErr.message, 500)
  }

  return ok({ id: diary.id }, 201)
}

export { OPTIONS } from '@/app/apis/_lib/http'
