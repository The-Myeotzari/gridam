import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'

export async function getCurrentUserName(): Promise<string> {
  const { supabase, user } = await getAuthenticatedUser()

  const nickname = (user.user_metadata?.nickname as string | undefined)?.trim()

  return nickname && nickname.length > 0 ? nickname : '?'
}
