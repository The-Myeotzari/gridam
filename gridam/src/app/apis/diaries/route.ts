import { MESSAGES } from '@/shared/constants/messages'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { withSignedImageUrls } from '@/shared/utils/supabase/with-signed-image-urls'
import { NextRequest, NextResponse } from 'next/server'

export const DEFAULT_LIMIT = 5

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const year = searchParams.get('year')
    const month = searchParams.get('month')
    const cursor = searchParams.get('cursor')
    const limit = Number(searchParams.get('limit')) || DEFAULT_LIMIT

    const { supabase, user } = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ message: MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER }, { status: 401 })
    }

    let query = supabase
      .from('diaries')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    // 연/월 필터 적용
    if (year && month) {
      const start = new Date(Number(year), Number(month) - 1, 1).toISOString()
      const end = new Date(Number(year), Number(month), 1).toISOString()
      query = query.gte('published_at', start).lt('published_at', end)
    }

    // 커서 기반 페이지네이션
    if (cursor) {
      query = query.lt('published_at', cursor)
    }

    // created_at 기준 정렬 + limit +1
    query = query.order('created_at', { ascending: false }).limit(limit + 1)

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ message: MESSAGES.DIARY.ERROR.READ }, { status: 500 })
    }

    // 결과 없음
    if (!data || data.length === 0) {
      return NextResponse.json({
        items: [],
        nextCursor: null,
        hasMore: false,
      })
    }

    // hasMore 판별
    const hasMore = data.length > limit
    const items = hasMore ? data.slice(0, limit) : data

    // 이미지 signed URL 포함
    const diariesWithSignedUrls = await withSignedImageUrls(supabase, items)

    // 다음 커서 설정
    const lastItem = items[items.length - 1]

    return NextResponse.json({
      items: diariesWithSignedUrls,
      nextCursor: hasMore ? lastItem.published_at : null,
      hasMore,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     const { supabase, user } = await getAuthenticatedUser()
//     if (!user) return withCORS(fail(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER, 401))
//     const body = await req.json()

//     const parsed = createSchema.safeParse(body)
//     if (!parsed.success) return withCORS(fail(MESSAGES.DIARY.ERROR.CREATE_NO_DATA, 422))

//     const { content, date, emoji, imageUrl, meta } = parsed.data

//     // 중복체크
//     const start = new Date(`${date}T00:00:00.000Z`).toISOString()
//     const end = new Date(`${date}T23:59:59.999Z`).toISOString()

//     const { data: existingDiary, error: existingError } = await supabase
//       .from('diaries')
//       .select('id')
//       .eq('user_id', user.id)
//       .gte('created_at', start)
//       .lte('created_at', end)
//       .is('deleted_at', null)
//       .maybeSingle()

//     if (existingError) {
//       return withCORS(fail(MESSAGES.DIARY.ERROR.READ, 500))
//     }
//     if (existingDiary) {
//       return withCORS(fail(MESSAGES.DIARY.ERROR.CREATE_OVER, 409))
//     }

//     const { data: diary, error } = await supabase
//       .from('diaries')
//       .insert({
//         user_id: user.id,
//         content,
//         date, // 제거 필요 - created_at과 동일
//         emoji,
//         image_url: imageUrl ?? null,
//         status: 'published',
//         published_at: new Date().toISOString(),
//       })
//       .select('id')
//       .single()

//     if (error) return withCORS(fail(MESSAGES.DIARY.ERROR.CREATE, 500))

//     if (meta) {
//       const { error: metaErr } = await supabase.from('metadata').insert({
//         diary_id: diary.id,
//         date, // 제거 필요 - created_at과 동일
//         timezone: meta.timezone, // 시간대
//       })
//     }

//     return withCORS(ok({ id: diary.id }, 201))
//   } catch (err) {
//     console.error('🔥 DIARY API ERROR:', err)
//     if (err instanceof ZodError) {
//       const firstIssue = err.issues[0]
//       return fail(firstIssue.message, 400)
//     }
//     return withCORS(fail(MESSAGES.DIARY.ERROR.CREATE, 500))
//   }
// }

export { OPTIONS } from '@/app/apis/_lib/http'
