import getSupabaseServer from '@/shared/utils/supabase/server'
import { withSignedImageUrls } from '@/shared/utils/with-signed-image-urls'

export async function getCurrentUserImage(): Promise<string | null> {
  const supabase = await getSupabaseServer()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    console.error(error)
    return null
  }

  const rawUrl = user.user_metadata?.avatar_url as string | undefined
  if (!rawUrl) return null

  try {
    const [signedItem] = await withSignedImageUrls(supabase, [{ image_url: rawUrl }], 6000 * 10)

    return signedItem?.image_url ?? rawUrl
  } catch (err) {
    console.error(err)
    return rawUrl
  }
}
