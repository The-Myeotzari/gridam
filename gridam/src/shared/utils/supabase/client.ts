// NOTE: 사용하는지에 대한 여부 판단 후 유지 및 삭제 결론 필요
import type { Database } from '@/shared/types/database.types'
import type { TypedSupabaseClient } from '@/shared/types/toast.type'
import { createBrowserClient } from '@supabase/ssr'
import { useMemo } from 'react'

let client: TypedSupabaseClient | undefined

function getSupabaseBrowserClient() {
  if (client) {
    return client
  }

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return client
}

function useSupabaseBrowser() {
  return useMemo(() => getSupabaseBrowserClient(), [])
}

export default useSupabaseBrowser
