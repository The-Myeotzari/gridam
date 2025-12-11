'use clinet'

import getSupabaseBrowserClient from '@/shared/utils/supabase/client'
import { withSignedImageUrls } from '@/shared/utils/with-signed-image-urls'
import { useEffect, useState } from 'react'

export const useCurrentUserImage = () => {
  const [image, setImage] = useState<string | null>(null)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    let cancelled = false

    const fetchUserImage = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error(error)
        if (!cancelled) setImage(null)
        return
      }

      const rawUrl = session?.user.user_metadata?.avatar_url as string | undefined
      if (!rawUrl) {
        if (!cancelled) setImage(null)
        return
      }

      const [signedItem] = await withSignedImageUrls(supabase, [{ image_url: rawUrl }], 6000 * 10)

      if (!cancelled) {
        setImage(signedItem?.image_url ?? rawUrl)
      }
    }

    fetchUserImage()

    return () => {
      cancelled = true
    }
  }, [supabase])

  return image
}
