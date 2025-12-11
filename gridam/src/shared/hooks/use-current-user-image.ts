'use clinet'

import getSupabaseBrowserClient from '@/shared/utils/supabase/client'
import { useEffect, useState } from 'react'

export const useCurrentUserImage = () => {
  const [image, setImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserImage = async () => {
      const { data, error } = await getSupabaseBrowserClient().auth.getSession()
      if (error) {
        console.error(error)
      }

      setImage(data.session?.user.user_metadata.avatar_url ?? null)
    }
    fetchUserImage()
  }, [])

  return image
}
