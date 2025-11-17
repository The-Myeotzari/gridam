import { SupabaseClient } from '@supabase/supabase-js'

type ParsedStorageUrl = {
  bucket: string
  path: string
}

export function parseStorageUrl(imageUrl: string): ParsedStorageUrl | null {
  try {
    const url = new URL(imageUrl)
    const segments = url.pathname.split('/').filter(Boolean)
    const objectIndex = segments.indexOf('object')
    if (objectIndex === -1 || objectIndex + 2 >= segments.length) return null

    const bucket = segments[objectIndex + 2]
    const pathSegments = segments.slice(objectIndex + 3)
    const path = pathSegments.join('/')

    if (!bucket || !path) return null

    return { bucket, path }
  } catch {
    return null
  }
}

export async function withSignedImageUrls<T extends { image_url?: string | null }>(
  supabase: SupabaseClient,
  items: T[],
  expiresInSeconds = 60 * 5
): Promise<T[]> {
  const EXPIRES_IN_SECONDS = expiresInSeconds

  const result: T[] = await Promise.all(
    items.map(async (item) => {
      const rawUrl = item.image_url
      if (!rawUrl) return item

      const parsed = parseStorageUrl(rawUrl)
      if (!parsed) return item

      const { bucket, path } = parsed

      const { data: signed, error: signedError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, EXPIRES_IN_SECONDS)

      if (signedError || !signed?.signedUrl) {
        console.error('Error creating signed URL:', signedError)
        return item
      }

      return {
        ...item,
        image_url: signed.signedUrl,
      }
    })
  )

  return result
}
