import { NextRequest } from 'next/server'
import { fail, ok } from '@/app/apis/_lib/http'
import { MESSAGES } from '@/shared/constants/messages'
import { Diary } from '@/features/mypage/types/mypage'
import { withSignedImageUrls } from '@/shared/utils/with-signed-image-urls'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const yearParam = searchParams.get('year')
    const monthParam = searchParams.get('month')

    const year = Number(yearParam)
    const month = Number(monthParam)

    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
      return fail(MESSAGES.DIARY.ERROR.EXPORT_INVALID_DATA, 400)
    }

    const { supabase, user } = await getAuthenticatedUser()

    if (!user) {
      return fail(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER, 401)
    }

    const fromDate = new Date(year, month - 1, 1)
    const toDate = new Date(year, month, 1)

    const from = fromDate.toISOString().slice(0, 10) // 'YYYY-MM-DD'
    const to = toDate.toISOString().slice(0, 10)

    // published만 포함 (draft 제외)
    const { data, error } = await supabase
      .from('diaries')
      .select(`*`)
      .eq('user_id', user.id)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .is('deleted_at', null)
      .gte('created_at', from)
      .lt('created_at', to)
      .order('created_at', { ascending: true })

    if (error) {
      return fail(MESSAGES.DIARY.ERROR.READ, 400)
    }

    const diaries: Diary[] = data ?? []

    const diariesWithImages: Diary[] = await withSignedImageUrls<Diary>(supabase, diaries)

    return ok({
      year,
      month,
      diaries: diariesWithImages,
    })
  } catch {
    return fail(MESSAGES.DIARY.ERROR.READ, 500)
  }
}
