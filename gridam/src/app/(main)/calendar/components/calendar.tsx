'use client'
import { useMemo, useState } from 'react'
import buildCalendar, { weekday } from '@/app/(main)/calendar/lib/build-calendar'
import { CircleChevronLeft, CircleChevronRight } from 'lucide-react'
import cn from '@/shared/utils/cn'
import { MonthlyData } from './calendar-client'

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
}: CalendarProps) {
  console.log('현재 선택된 날짜 (Props):', selectedDate)

  const cells = useMemo(() => {
    return buildCalendar(currentView.year, currentView.month)
  }, [currentView.year, currentView.month])

  // 이전 달
  const handlePrevMonth = () => {
    let year = currentView.year
    let month = currentView.month - 1

    if (month < 0) {
      month = 11
      year -= 1
    }
    onViewChange({ year, month })
  }
  // 다음 달
  const handleNextMonth = () => {
    let year = currentView.year
    let month = currentView.month + 1

    if (month > 11) {
      month = 0
      year += 1
    }

    onViewChange({ year, month })
  }

  return (
    <div className="flex flex-col gap-4 justify-center">
      <div className="flex justify-between min-h-auto items-center">
        <CircleChevronLeft
          color="#2c2e44"
          strokeWidth={1.25}
          className="h-8 w-8 hover:cursor-pointer hover:bg-accent rounded-xl"
          onClick={handlePrevMonth}
        />

        <div className="text-2xl">
          {currentView.year}년 {currentView.month + 1}월
        </div>

        <CircleChevronRight
          color="#2c2e44"
          strokeWidth={1.25}
          className="h-8 w-8 hover:cursor-pointer hover:bg-accent rounded-xl"
          onClick={handleNextMonth}
        />
      </div>

      <div className="flex justify-around text-center min-h-8 items-center">
        {weekday.map((day) => {
          return <div key={day}>{day}</div>
        })}
      </div>

      <div className="grid grid-cols-7  text-center ">
        {cells.map((cell, idx) => {
          const isSelected =
            selectedDate &&
            selectedDate.year === cell.year &&
            selectedDate.month - 1 === cell.month &&
            selectedDate.day === cell.day
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
                isSelected && 'bg-accent rounded-sm '
              )}
            >
              {cell.day}
            </div>
          )
        })}
      </div>
    </div>
  )
}
