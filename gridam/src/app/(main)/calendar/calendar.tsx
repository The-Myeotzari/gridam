'use client'
import { useMemo, useState } from 'react'
import buildCalendar, { weekday } from './build-calendar'
import { CircleChevronLeft, CircleChevronRight } from 'lucide-react'
import cn from '@/shared/utils/cn'

export default function Calendar() {
  const today = new Date()
  // 날짜 선택
  const [selectedDate, setSelectedDate] = useState<{
    year: number
    month: number
    date: number
  } | null>(null)

  const [view, setView] = useState(() => ({ year: today.getFullYear(), month: today.getMonth() }))

  const cells = useMemo(() => {
    return buildCalendar(view.year, view.month)
  }, [view.year, view.month])

  // 이전 달
  const handlePrevMonth = () => {
    setView((prev) => {
      let year = prev.year
      let month = prev.month - 1

      if (month < 0) {
        month = 11
        year -= 1
      }
      return { year, month }
    })
  }
  // 다음 달
  const handleNextMonth = () => {
    setView((prev) => {
      let year = prev.year
      let month = prev.month + 1

      if (month > 11) {
        month = 0
        year += 1
      }
      console.log('셀', cells)
      return { year, month }
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-around">
        <CircleChevronLeft
          color="#2c2e44"
          strokeWidth={1.25}
          className="h-5 w-5 hover:cursor-pointer hover:bg-accent rounded-xl"
          onClick={handlePrevMonth}
        />

        <div>
          {view.year}년 {view.month + 1}월
        </div>

        <CircleChevronRight
          color="#2c2e44"
          strokeWidth={1.25}
          className="h-5 w-5 hover:cursor-pointer hover:bg-accent rounded-xl"
          onClick={handleNextMonth}
        />
      </div>

      <div className="grid grid-cols-7 text-center">
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
            selectedDate.date === cell.date
          return (
            <div
              key={idx}
              onClick={() => {
                if (isSelected) {
                  setSelectedDate(null)
                } else {
                  setSelectedDate({ year: cell.year, month: cell.month, date: cell.date })
                }
              }}
              className={cn(
                `p-2 ${cell.inCurrentMonth ? '' : 'text-muted-foreground/40'}`,
                'hover:cursor-pointer',
                isSelected && 'bg-accent rounded-sm '
              )}
            >
              {cell.date}
            </div>
          )
        })}
      </div>
    </div>
  )
}
