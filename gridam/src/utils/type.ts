import type { Database } from '@/types/database.types'
import { SupabaseClient } from '@supabase/supabase-js'

export type TypedSupabaseClient = SupabaseClient<Database>

export type Toast = {
  id: string
  message: string
  type: 'success' | 'error'
  duration?: number
}
