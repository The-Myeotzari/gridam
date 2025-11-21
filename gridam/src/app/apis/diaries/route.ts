import { MESSAGES } from '@/shared/constants/messages'
import { createSchema } from '@/shared/types/zod/apis/diaries'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { withSignedImageUrls } from '@/shared/utils/supabase/with-signed-image-urls'
import { uploadDiaryImage } from '@/shared/utils/uploads/upload-diary-image'
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
      return NextResponse.json(
        { ok: false, message: MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER },
        { status: 401 }
      )
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
      return NextResponse.json({ ok: false, message: MESSAGES.DIARY.ERROR.READ }, { status: 500 })
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
      ok: true,
      data: {
        items: diariesWithSignedUrls,
        nextCursor: hasMore ? lastItem.published_at : null,
        hasMore,
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { supabase, user } = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json(
        { ok: false, message: MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER },
        { status: 401 }
      )
    }

    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: MESSAGES.DIARY.ERROR.CREATE_NO_DATA },
        { status: 400 }
      )
    }

    const { content, date, emoji, imageUrl, meta } = parsed.data

    // 중복체크
    const start = new Date(`${date}T00:00:00.000Z`).toISOString()
    const end = new Date(`${date}T23:59:59.999Z`).toISOString()

    const { data: existingDiary, error: existingError } = await supabase
      .from('diaries')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', start)
      .lte('created_at', end)
      .is('deleted_at', null)
      .maybeSingle()

    if (existingError) {
      return NextResponse.json({ ok: false, message: MESSAGES.DIARY.ERROR.READ }, { status: 500 })
    }

    if (existingDiary) {
      return NextResponse.json(
        { ok: false, message: MESSAGES.DIARY.ERROR.CREATE_OVER },
        { status: 409 }
      )
    }

    let uploadedUrl: string | null = null

    if (imageUrl) {
      const { url } = await uploadDiaryImage(imageUrl, user.id)
      uploadedUrl = url
    }

    const { data: diary, error } = await supabase
      .from('diaries')
      .insert({
        user_id: user.id,
        content,
        date,
        emoji,
        image_url: uploadedUrl,
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (error) {
      return NextResponse.json({ ok: false, message: MESSAGES.DIARY.ERROR.CREATE }, { status: 500 })
    }

    if (meta) {
      await supabase.from('metadata').insert({
        diary_id: diary.id,
        date,
        timezone: meta.timezone,
      })
    }

    return NextResponse.json({ ok: true, id: diary.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, message: MESSAGES.DIARY.ERROR.CREATE }, { status: 500 })
  }
}

export { OPTIONS } from '@/app/apis/_lib/http'
