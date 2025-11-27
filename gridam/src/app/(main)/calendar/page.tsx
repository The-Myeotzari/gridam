import { fetchCalendar } from '@/app/(main)/calendar/action'
import CalendarClient from './components/calendar-client'

export default async function Page() {
  // 오늘 날짜 (전역 관리)
  const today = new Date()
  const initialDate = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  }

  //서버에서 초기 데이터 로드
  const { ok, data: initialData } = await fetchCalendar(initialDate)
  // 특정 날짜 조회
  // await fetchCalendarData({date: { year: 2025, month: 2, day: 10 }})
  console.log(initialData)

  if (!ok) {
    return <div>캘린더의 데이터를 불러오지 못했습니다.</div>
  }

  return (
    <div>
      <div className="mb-8 text-center animate-fade-in">
        <h1 className="font-handwritten text-4xl mb-2 text-navy-gray">캘린더</h1>
        <p className="font-handwritten text-xl text-muted-foreground">날짜별 그림 일기</p>
      </div>
      <CalendarClient initialDate={initialDate} initialData={initialData}></CalendarClient>
    </div>
  )
}
