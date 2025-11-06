import { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from 'database.types'

export type TypedSupabaseClient = SupabaseClient<Database>


export type Toast = {
  id: string
  message: string
  type: 'success' | 'error'
  duration?: number
}
