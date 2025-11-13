import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

type props = {
  year: string
  month: string
}

export default function Month({ year, month }: props) {
  const now = new Date()

  const currentYear = year ? Number(year) : now.getFullYear()
  const currentMonth = month ? Number(month) : now.getMonth() + 1

  const currentDate = new Date(currentYear, currentMonth - 1, 1)

  const prevDate = new Date(currentYear, currentMonth - 2, 1)
  const nextDate = new Date(currentYear, currentMonth, 1)

  const format = (date: Date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`

  return (
    <div className="mb-8 flex justify-center items-center gap-8">
      {/* 이전 달 */}
      <Link href={`?year=${prevDate.getFullYear()}&month=${prevDate.getMonth() + 1}`}>
        <ChevronLeft className="h-4 sm:h-6 w-4 sm:w-6 cursor-pointer" />
      </Link>

      <h2 className="font-semibold text-lg sm:text-3xl text-navy-gray min-w-[180px] text-center">
        {format(currentDate)}
      </h2>

      {/* 다음 달 */}
      <Link href={`?year=${nextDate.getFullYear()}&month=${nextDate.getMonth() + 1}`}>
        <ChevronRight className="h-4 sm:h-6 w-4 sm:w-6 cursor-pointer" />
      </Link>
    </div>
  )
}
