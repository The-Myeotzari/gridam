import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { formatYearMonth, getAdjacentMonth, resolveYearMonthFromStrings } from '../utils/diary-date'

type props = {
  year: string
  month: string
}

export default function Month({ year, month }: props) {
  const { year: y, month: m } = resolveYearMonthFromStrings(year, month)

  const current = getAdjacentMonth(y, m, 0)
  const prev = getAdjacentMonth(y, m, -1)
  const next = getAdjacentMonth(y, m, 1)

  return (
    <div className="mb-8 flex justify-center items-center gap-8">
      {/* 이전 달 */}
      <Link href={`?year=${prev.year}&month=${prev.month}`}>
        <ChevronLeft className="h-4 sm:h-6 w-4 sm:w-6 cursor-pointer" />
      </Link>

      <h2 className="font-semibold text-lg sm:text-3xl text-navy-gray min-w-[180px] text-center">
        {formatYearMonth(current.date)}
      </h2>

      {/* 다음 달 */}
      <Link href={`?year=${next.year}&month=${next.month}`}>
        <ChevronRight className="h-4 sm:h-6 w-4 sm:w-6 cursor-pointer" />
      </Link>
    </div>
  )
}
