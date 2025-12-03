import { MESSAGES } from '@/shared/constants/messages'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { NextRequest, NextResponse } from 'next/server'

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

    const diary = diaryData?.length ? diaryData[0] : null

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
