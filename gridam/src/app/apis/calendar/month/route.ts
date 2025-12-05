import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { MESSAGES } from '@/shared/constants/messages'

type MonthlyData = Record<number, { hasDiary: boolean; hasMemo: boolean }>

export async function GET(req: NextRequest) {
  try {
    const { supabase, user } = await getAuthenticatedUser()
    const { searchParams } = await new URL(req.url)

    const yearParam = searchParams.get('year')
    const monthParam = searchParams.get('month')

    if (!yearParam || !monthParam) {
      return NextResponse.json({ ok: false, message: '년/월 데이터가 없습니다.' }, { status: 400 })
    }

    const year = Number(yearParam)
    const month = Number(monthParam)

    if (Number.isNaN(year) || Number.isNaN(month)) {
      return NextResponse.json({ ok: false, message: '년/월 형식이 올바르지 않습니다.' })
    }

    // month 처리
    //마지막 날 구하기
    const mm = String(month).padStart(2, '0')
    const lastDay = new Date(year, month, 0).getDate()

    // diaries용 문자열 날짜 범위
    const monthStartDate = `${year}-${mm}-01`
    const monthEndDate = `${year}-${mm}-${String(lastDay).padStart(2, '0')}`

    // memos용 created_at 범위
    const monthStart = new Date(year, month - 1, 1, 0, 0, 0)
    const monthEnd = new Date(year, month, 0, 23, 59, 59, 999)
    const monthStartISO = monthStart.toISOString()
    const monthEndISO = monthEnd.toISOString()

    // 02) 월 전체 일기 조회
    const { data: monthDiaries, error: diariesError } = await supabase
      .from('diaries')
      .select('date')
      .eq('user_id', user.id)
      .eq('status', 'published')
      .is('deleted_at', null)
      .gte('published_at', monthStartDate)
      .lte('published_at', monthEndDate)

    if (diariesError) {
      console.error(diariesError)
      return NextResponse.json({ ok: false, message: MESSAGES.DIARY.ERROR.READ }, { status: 500 })
    }

    // 03) 월 전체 메모 조회
    const { data: monthMemos, error: memosError } = await supabase
      .from('memos')
      .select('created_at')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .gte('created_at', monthStartISO)
      .lte('created_at', monthEndISO)

    if (memosError) {
      console.error(memosError)
      return NextResponse.json({ ok: false, message: '메모 조회에 실패했습니다.' }, { status: 500 })
    }

    // 04) monthlyData 구조 만들기
    const monthlyData: MonthlyData = {}

    // 일기 있는 날 체크
    monthDiaries?.forEach((d) => {
      if (!d.date) return
      const parts = d.date.split('-') // ["YYYY","MM","DD"]
      const dayNum = Number(parts[2])
      if (!dayNum) return

      if (!monthlyData[dayNum]) {
        monthlyData[dayNum] = { hasDiary: false, hasMemo: false }
      }
      monthlyData[dayNum].hasDiary = true
    })

    // 메모 있는 날 체크
    monthMemos?.forEach((m) => {
      if (!m.created_at) return
      const date = new Date(m.created_at)
      const dayNum = date.getDate()
      if (!dayNum) return

      if (!monthlyData[dayNum]) {
        monthlyData[dayNum] = { hasDiary: false, hasMemo: false }
      }
      monthlyData[dayNum].hasMemo = true
    })

    // 05) 최종 응답
    return NextResponse.json({
      ok: true,
      data: {
        monthlyData,
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, message: 'Internal Server Error' }, { status: 500 })
  }
}
