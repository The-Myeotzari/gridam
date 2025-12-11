'use client'
import { fetchCalendar, fetchCalendarMonth } from '@/app/(main)/calendar/action'
import Calendar from '@/features/calendar/components/calendar'
import CalendarMemoList from '@/features/calendar/components/calendar-memo-list'
import SelectedDateDiary from '@/features/calendar/components/selected-date-diary'
import type { Diary } from '@/features/feed/feed.type'
import type { Memo } from '@/features/memo/api/memo.action'
import { Card } from '@/shared/ui/card'
import { getFormatDate } from '@/shared/utils/date'
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import type { MonthlyData } from '../types/calendar.type'

interface CalendarClientProps {
  initialDate: { year: number; month: number; day: number }
  initialData: { diary?: Diary | null; memos?: Memo[]; monthlyData?: MonthlyData }
}

type initialDateView = Omit<CalendarClientProps['initialDate'], 'day'>

export default function CalendarClient({ initialDate, initialData }: CalendarClientProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [diary, setDiary] = useState<Diary>(initialData.diary ?? ({} as Diary))
  const [memos, setMemos] = useState<Memo[]>(initialData.memos ?? [])
  const [isPending, startTransition] = useTransition()
  //날짜마다 메모나 일기가 있는지 표시
  const [monthlyData, setMonthlyData] = useState<MonthlyData>(initialData.monthlyData || {})
  const [view, setView] = useState<initialDateView>(() => ({
    year: initialDate.year,
    month: initialDate.month,
  }))
  //캘린더-날짜 클릭 시 메모 영역 상단 날짜 업데이트
  const dateFormatting = new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day)
  const todayDate = getFormatDate(dateFormatting.toISOString())

  //캘린더에 월별 일기, 메모 표시
  useEffect(() => {
    setMonthlyData({}) //월 전환 시 이전 데이터 초기화
    startTransition(async () => {
      const res = await fetchCalendarMonth({
        year: view.year,
        month: view.month,
      })

      if (res.ok && res.data.monthlyData) {
        setMonthlyData(res.data.monthlyData)
      }
    })
  }, [view.year, view.month])

  // 캘린더에서 날짜가 선택되었을 때
  const handleSelectDate = useCallback((date: { year: number; month: number; day: number }) => {
    const newDate = { year: date.year, month: date.month, day: date.day }
    setSelectedDate(newDate)
    //2. 일별- 일기, 메모 데이터
    startTransition(async () => {
      const res = await fetchCalendar(newDate)
      if (res.ok) {
        setDiary(res.data.diary ?? ({} as Diary))
        setMemos(res.data.memos ?? [])
      }
    })
  }, [])
  //props 메모화 -> 불필요한 리렌더링 방지
  const calendarProps = useMemo(
    () => ({
      selectedDate: selectedDate,
      onSelectDate: handleSelectDate,
      monthlyData: monthlyData, // 일기/메모 표시
      currentView: view,
      onViewChange: setView,
    }),
    [selectedDate, handleSelectDate, monthlyData, view, setView]
  )
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-2 ">
      <Card className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] p-6 gap-7 ">
        <Calendar {...calendarProps} />
        <div className="overflow-hidden">
          <SelectedDateDiary isLoading={isPending} selectedDate={selectedDate} diary={diary} />
        </div>
      </Card>
      <Card className="flex flex-col md:flex-row p-6 gap-7 ">
        <div className="mb-4 flex flex-col flex-1 gap h-full">
          <h3 className="font-handwritten text-xl mb-2 text-navy-gray font-bold">메모</h3>
          <div className="bg-pink-400 text-xs w-34 text-center text-white rounded-full p-1.5 mb-2 ">
            {todayDate}
          </div>
          {/* 메모 목록 */}
          <CalendarMemoList memos={memos} isLoading={isPending} />
        </div>
      </Card>
    </div>
  )
}
