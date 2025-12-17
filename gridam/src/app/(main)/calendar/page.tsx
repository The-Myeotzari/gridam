import { fetchCalendar } from '@/app/(main)/calendar/action'
import CalendarClient from '@/features/calendar/components/calendar-client'
import { getDateParts } from '@/shared/utils/date'

export default async function Page() {
  // 오늘 날짜 (전역 관리)
  const initialDate = getDateParts()

  //서버에서 초기 데이터 로드
  const { ok, data: initialData } = await fetchCalendar(initialDate)

  if (!ok) {
    return <div>캘린더 데이터를 불러오지 못했습니다.</div>
  }

  return (
    <div>
      <div className="mb-8 text-center animate-fade-in">
        <h1 className="font-handwritten text-4xl mb-2 text-navy-gray font-bold">캘린더</h1>
        <p className="font-handwritten text-xl text-muted-foreground">일기와 메모를 한눈에</p>
      </div>
      <CalendarClient initialDate={initialDate} initialData={initialData} />
    </div>
  )
}
