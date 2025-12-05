'use client'
import { useMemo } from 'react'
import { CircleChevronLeft, CircleChevronRight } from 'lucide-react'
import cn from '@/shared/utils/cn'
import { MonthlyData } from './calendar-client'
import buildCalendar, { weekday } from '../lib/build-calendar'
import { getAdjacentMonth } from '@/shared/utils/date'

interface CalendarProps {
  // 캘린더가 외부에서 관리하는 데이터를 받는다.
  selectedDate: {
    year: number
    month: number
    day: number
  }
  //날짜 선택 시 호출할 함수
  onSelectDate: (date: { year: number; month: number; day: number }) => void
  monthlyData: MonthlyData
  currentView: { year: number; month: number }
  onViewChange: (view: { year: number; month: number }) => void

  //월 상태를 Prop으로 받음.
}

export default function Calendar({
  selectedDate,
  onSelectDate,
  currentView,
  onViewChange,
  monthlyData,
}: CalendarProps) {
  // 달력 셀
  const cells = useMemo(() => {
    return buildCalendar(currentView.year, currentView.month)
  }, [currentView.year, currentView.month])

  // 이전 달
  const handlePrevMonth = () => {
    const preveMonth = getAdjacentMonth(currentView.year, currentView.month, -1)
    onViewChange(preveMonth)
  }
  // 다음 달
  const handleNextMonth = () => {
    const NextMonth = getAdjacentMonth(currentView.year, currentView.month, 1)
    onViewChange(NextMonth)
  }

  return (
    <div className="flex flex-col gap-4 border-b-2 pb-7 border-accent-foreground lg:border-none lg:pb-0">
      <div className="flex justify-between min-h-auto items-center">
        <CircleChevronLeft
          strokeWidth={1}
          className="h-8 w-8 rounded-xl stroke-muted-foreground/70 hover:cursor-pointer hover:bg-accent hover:stroke-muted-foreground"
          onClick={handlePrevMonth}
        />

        <div className="text-2xl font-bold">
          {currentView.year}년 {currentView.month}월
        </div>

        <CircleChevronRight
          color="#2c2e44"
          strokeWidth={1.25}
          className="h-8 w-8 rounded-xl stroke-muted-foreground/70 hover:cursor-pointer hover:bg-accent hover:stroke-muted-foreground"
          onClick={handleNextMonth}
        />
      </div>

      <div className="flex justify-around text-center items-center  text-muted-foreground font-bold">
        {weekday.map((day) => {
          return <div key={day}>{day}</div>
        })}
      </div>

      <div className="grid grid-cols-7 text-center ">
        {cells.map((cell, idx) => {
          const isSelected =
            selectedDate &&
            selectedDate.year === cell.year &&
            selectedDate.month === cell.month &&
            selectedDate.day === cell.day

          //현재 달에 속하는 셀에만 monthlyData 적용
          const info = cell.inCurrentMonth ? monthlyData[cell.day] : undefined
          const hasDiary = info?.hasDiary
          const hasMemo = info?.hasMemo
          return (
            <div
              key={idx}
              onClick={() => {
                //클릭 이벤트
                onSelectDate({ year: cell.year, month: cell.month, day: cell.day })
              }}
              className={cn(
                // 달력에 표시할게 많지 않으면 center로 바꾸기
                'aspect-square flex justify-start items-start',
                `p-2 ${cell.inCurrentMonth ? '' : 'text-muted-foreground/40'}`,
                'hover:cursor-pointer',
                isSelected && 'bg-accent rounded-sm text-amber-900 font-bold'
              )}
            >
              <div className="flex flex-col items-center w-full h-full">
                <div>{cell.day}</div>
                <div className="flex items-center gap-0.5 h-full">
                  {hasDiary && <div className="w-2 h-2 rounded-full bg-blue-400" />}

                  {hasMemo && <div className="w-2 h-2 rounded-full bg-pink-400" />}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex justify-center gap-4 mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="font-handwritten">일기</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-pink-400" />
          <span className="font-handwritten ">메모</span>
        </div>
      </div>
    </div>
  )
}
