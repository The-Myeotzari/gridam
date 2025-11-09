import { fail, ok } from '@/app/apis/_lib/http'
import getSupabaseServer from '@/utils/supabase/server'

export async function POST(req: Request) {
  const supabase = await getSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return fail('Unauthorized', 401)

  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) return fail('file is required', 400)

  const filename = `diary/${crypto.randomUUID()}-${file.name}`
  const { data, error } = await supabase.storage
    .from('images')
    .upload(filename, file, { upsert: false })
  if (error) return fail(error.message, 500)

  const { data: pub } = supabase.storage.from('images').getPublicUrl(filename)
  return ok({ url: pub.publicUrl }, 201)
}

export { OPTIONS } from '@/app/apis/_lib/http'
