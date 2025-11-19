import { MESSAGES } from '@/shared/constants/messages'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { withSignedImageUrls } from '@/shared/utils/supabase/with-signed-image-urls'

export async function getDiary(id: string) {
  const { supabase, user } = await getAuthenticatedUser()
  if (!user) throw new Error(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER)

  const query = supabase.from('diaries').select('*').eq('id', id).single()
  const { data, error } = await query

  if (error) throw new Error(MESSAGES.DIARY.ERROR.READ)
  if (data?.image_url) {
    const signed = await withSignedImageUrls(await supabase, [data])
    return signed[0]
  }

  return data
}
