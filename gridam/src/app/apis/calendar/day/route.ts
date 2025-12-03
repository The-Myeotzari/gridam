import { MESSAGES } from '@/shared/constants/messages'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { NextRequest, NextResponse } from 'next/server'
import { withSignedImageUrls } from '@/shared/utils/with-signed-image-urls'
import type { Diary } from '@/features/feed/feed.type' // ✅ 타입 임포트

export async function GET(req: NextRequest) {
  try {
    const { supabase, user } = await getAuthenticatedUser()
    const { searchParams } = new URL(req.url)

    const year = searchParams.get('year')
    const month = searchParams.get('month')
    const day = searchParams.get('day')

    if (!year || !month || !day) {
      return NextResponse.json({ ok: false, message: '날짜 데이터가 없습니다.' }, { status: 400 })
    }

    // 선택한 날짜의 시작/끝 범위 계산
    const start = new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0)
    const end = new Date(Number(year), Number(month) - 1, Number(day), 23, 59, 59, 999)

    const startISO = start.toISOString()
    const endISO = end.toISOString()

    // 선택 날짜의 일기 조회 (published only)
    const { data: diaryData, error: diaryError } = await supabase
      .from('diaries')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'published')
      .is('deleted_at', null)
      .gte('published_at', startISO)
      .lte('published_at', endISO)
      .order('published_at', { ascending: false })
      .limit(1)

    if (diaryError) {
      return NextResponse.json({ ok: false, message: MESSAGES.DIARY.ERROR.READ }, { status: 500 })
    }

    // 기본값은 null
    let diary: Diary | null = null

    // 2) 여기서 fresh signed URL 생성
    if (diaryData && diaryData.length > 0) {
      const [signedDiary] = await withSignedImageUrls<Diary>(
        supabase,
        diaryData as Diary[],
        60 * 60 // 옵션: 1시간 TTL (안 넣으면 기본 5분)
      )
      diary = signedDiary
    }

    // 선택 날짜의 메모 조회
    const { data: memosData, error: memoError } = await supabase
      .from('memos')
      .select('*')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .gte('created_at', startISO)
      .lte('created_at', endISO)
      .order('created_at', { ascending: true })

    if (memoError) {
      return NextResponse.json({ ok: false, message: '메모 조회에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      data: {
        diary,
        memos: memosData ?? [],
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, message: 'Internal Server Error' }, { status: 500 })
  }
}
