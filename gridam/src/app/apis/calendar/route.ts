import { MESSAGES } from '@/shared/constants/messages'
import { getAuthenticatedUser } from '@/shared/utils/get-authenticated-user'
import { NextRequest, NextResponse } from 'next/server'

type MonthlyData = Record<number, { hasDiary: boolean; hasMemo: boolean }>

export async function GET(req: NextRequest) {
  try {
    const { supabase, user } = await getAuthenticatedUser()
    const { searchParams } = new URL(req.url)

    const yearParam = searchParams.get('year')
    const monthParam = searchParams.get('month')
    const dayParam = searchParams.get('day')

    // year, month는 무조건 필요 (day는 옵션)
    if (!yearParam || !monthParam) {
      return NextResponse.json({ ok: false, message: '년/월 데이터가 없습니다.' }, { status: 400 })
    }

    const year = Number(yearParam)
    const month = Number(monthParam) // 1~12

    if (Number.isNaN(year) || Number.isNaN(month)) {
      return NextResponse.json(
        { ok: false, message: '년/월 형식이 올바르지 않습니다.' },
        { status: 400 }
      )
    }

    const mm = String(month).padStart(2, '0')

    // 실제 그 달의 마지막 날짜 구하기
    const lastDayOfMonth = new Date(year, month, 0).getDate()
    const monthStartDateStr = `${year}-${mm}-01`
    const monthEndDateStr = `${year}-${mm}-${String(lastDayOfMonth).padStart(2, '0')}`

    // memos용 created_at 범위 (ISO)
    const monthStart = new Date(year, month - 1, 1, 0, 0, 0)
    const monthEnd = new Date(year, month, 0, 23, 59, 59, 999)
    const monthStartISO = monthStart.toISOString()
    const monthEndISO = monthEnd.toISOString()

    // 1) 이 달 전체에 대해 monthlyData 계산

    //이 달의 모든 일기 - date 컬럼 기준
    const { data: monthDiaries, error: monthDiariesError } = await supabase
      .from('diaries')
      .select('date')
      .eq('user_id', user.id)
      .eq('status', 'published')
      .is('deleted_at', null)
      .gte('date', monthStartDateStr)
      .lte('date', monthEndDateStr)

    if (monthDiariesError) {
      console.error('monthDiariesError', monthDiariesError)
      return NextResponse.json({ ok: false, message: MESSAGES.DIARY.ERROR.READ }, { status: 500 })
    }

    // 이 달의 모든 메모 (created_at 그대로 사용)
    const { data: monthMemos, error: monthMemosError } = await supabase
      .from('memos')
      .select('created_at')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .gte('created_at', monthStartISO)
      .lte('created_at', monthEndISO)

    if (monthMemosError) {
      console.error('monthMemosError', monthMemosError)
      return NextResponse.json({ ok: false, message: '메모 조회에 실패했습니다.' }, { status: 500 })
    }

    const monthlyData: MonthlyData = {}

    //일기 있는 날 표시: date 문자열 기준 ("YYYY-MM-DD")
    monthDiaries?.forEach((d) => {
      if (!d.date) return
      const parts = d.date.split('-') // ["2025","11","26"]
      const dayNum = Number(parts[2])
      if (!dayNum) return

      if (!monthlyData[dayNum]) {
        monthlyData[dayNum] = { hasDiary: false, hasMemo: false }
      }
      monthlyData[dayNum].hasDiary = true
    })

    // 메모 있는 날 표시 (created_at으로 날짜 뽑기)
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

    // 2) day가 없는 경우 → 월 정보만 응답

    if (!dayParam) {
      return NextResponse.json({
        ok: true,
        data: {
          diary: null,
          memos: [],
          monthlyData,
        },
      })
    }
    // 3) day가 있는 경우 → 해당 날짜의 diary/memos + 월 데이터 같이 응답
    const day = Number(dayParam)

    if (Number.isNaN(day)) {
      return NextResponse.json(
        { ok: false, message: '일 형식이 올바르지 않습니다.' },
        { status: 400 }
      )
    }

    const dd = String(day).padStart(2, '0')
    const dateKey = `${year}-${mm}-${dd}` // 예: "2025-11-26"
    // console.log('calendar day fetch:', { year, month, day, dateKey })
    // 선택 날짜의 일기 조회 (date 컬럼 기준)
    const { data: diaryData, error: diaryError } = await supabase
      .from('diaries')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'published')
      .is('deleted_at', null)
      .eq('date', dateKey) // published_at 범위 말고 date만
      .order('published_at', { ascending: false })
      .limit(1)
    // console.log('diaryData:', diaryData, 'diaryError:', diaryError)
    if (diaryError) {
      console.error('diaryError', diaryError)
      return NextResponse.json({ ok: false, message: MESSAGES.DIARY.ERROR.READ }, { status: 500 })
    }

    const diary = diaryData?.length ? diaryData[0] : null

    // 선택 날짜의 메모 조회 (created_at으로 하루 범위)
    const start = new Date(year, month - 1, day, 0, 0, 0)
    const end = new Date(year, month - 1, day, 23, 59, 59, 999)
    const startISO = start.toISOString()
    const endISO = end.toISOString()

    const { data: memosData, error: memoError } = await supabase
      .from('memos')
      .select('*')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .gte('created_at', startISO)
      .lte('created_at', endISO)
      .order('created_at', { ascending: true })

    if (memoError) {
      console.error('memoError', memoError)
      return NextResponse.json({ ok: false, message: '메모 조회에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      data: {
        diary,
        memos: memosData ?? [],
        monthlyData,
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, message: 'Internal Server Error' }, { status: 500 })
  }
}
