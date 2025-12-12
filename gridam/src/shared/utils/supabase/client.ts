import type { Database } from '@/shared/types/database.types'
import type { TypedSupabaseClient } from '@/shared/types/toast.type'
import { createBrowserClient } from '@supabase/ssr'

let client: TypedSupabaseClient | undefined

export default function getSupabaseBrowserClient() {
  if (client) {
    return client
  }

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return client
}
