import getSupabaseServer from '@/shared/utils/supabase/server'

export async function getCurrentUserName(): Promise<string> {
  const supabase = await getSupabaseServer()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    console.error(error)
    return '?'
  }

  const nickname = (user.user_metadata?.nickname as string | undefined)?.trim()

  return nickname && nickname.length > 0 ? nickname : '?'
}
