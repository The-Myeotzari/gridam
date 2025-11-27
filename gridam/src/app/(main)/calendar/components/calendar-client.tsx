'use client'
import { Card } from '@/shared/ui/card'
import Calendar from './calendar'
import SelectedDateDiary from './selected-date-diary'
import CalendarMemoList from './calendar-memo-list'
import { useEffect, useState, useTransition, startTransition } from 'react'
import { fetchCalendar } from '../action'
//날짜를 키로 (1 ~ 31), 데이터 존재 여부를 값으로 가짐
export type MonthlyData = Record<number, { hasDiary: boolean; hasMemo: boolean }>

interface CalendarClientProps {
  initialDate: { year: number; month: number; day: number }
  initialData: { diary?: any; memos?: any[]; monthlyData?: MonthlyData }
}

export default function CalendarClient({ initialDate, initialData }: CalendarClientProps) {
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [diary, setDiary] = useState(initialData.diary)
  const [memos, setMemos] = useState(initialData.memos)
  const [isPending, startTransition] = useTransition()
  //날짜마다 메모나 일기가 있는지 표시
  const [monthlyData, setMonthlyData] = useState<MonthlyData>(initialData.monthlyData || {})
  const [view, setView] = useState(() => ({ year: today.getFullYear(), month: today.getMonth() })) //0 ~11

  useEffect(() => {
    // view가 바뀌었을 때만 실행
    startTransition(async () => {
      // day 파라미터 없이 fetchCalendar를 호출하여 월별 맵만 요청해야 함
      const res = await fetchCalendar({
        year: view.year,
        month: view.month + 1,
      })

      if (res.ok && res.data.monthlyData) {
        // API 응답에 monthlyData가 있다고 가정
        setMonthlyData(res.data.monthlyData)
      }
    })
  }, [view.year, view.month])

  // 1. Calendar에서 날짜가 선택되었을 때 호출
  const handleSelectDate = (date: { year: number; month: number; day: number }) => {
    const newDate = { year: date.year, month: date.month + 1, day: date.day }
    //2. 선택된 날짜 업데이트
    setSelectedDate(newDate)

    //2. 서버에서 데이터 가져오기
    startTransition(async () => {
      const res = await fetchCalendar(newDate)
      if (res.ok) {
        setDiary(res.data.diary ?? null)
        setMemos(res.data.memos ?? [])
        if (res.data.monthlyData) {
          setMonthlyData(res.data.monthlyData)
        }
      }
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-2">
      <Card className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] p-6 gap-7 ">
        <Calendar
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          monthlyData={monthlyData} // 일기/메모 표시
          currentView={view}
          onViewChange={setView}
        />
        <SelectedDateDiary isLoading={isPending} selectedDate={selectedDate} diary={diary} />
      </Card>
      <Card className="flex flex-col md:flex-row p-6 gap-7 ">
        <CalendarMemoList memos={memos} isLoading={isPending} />
      </Card>
    </div>
  )
}
