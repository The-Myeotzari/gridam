import DiaryExportContainer from '@/features/mypage/components/export/diary-export-container'
import { getMonthlyDiaries } from '@/app/(main)/mypage/action'
import { MonthlyDiaries } from '@/features/mypage/types/mypage'
import { getDateParts } from '@/shared/utils/date'

export default async function DiaryExportSection() {
  const now = new Date()

  const { year: initialYear, month: initialMonth} = getDateParts(undefined, now)
  let initialMonthly: MonthlyDiaries | null = null
  let initialError: boolean = false
  try {
    initialMonthly = await getMonthlyDiaries({ year: initialYear.toString(), month: initialMonth.toString() })
  } catch {
    initialError = true
  }

  return (
    <DiaryExportContainer
      initialYear={initialYear}
      initialMonth={initialMonth}
      initialMonthly={initialMonthly}
      initialError={initialError}
    />
  )
}