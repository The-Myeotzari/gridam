import DiaryExportContainer from '@/features/mypage/components/export/diary-export-container'
import { getMonthlyDiaries } from '@/app/(main)/mypage/action'
import { MonthlyDiaries } from '@/features/mypage/types/mypage'

export default async function DiaryExportSection() {
  const now = new Date()

  const initialYear: number = now.getFullYear()
  const initialMonth: number = now.getMonth() + 1
  let initialMonthly: MonthlyDiaries | null = null
  let initialError: boolean = false
  try {
    initialMonthly = await getMonthlyDiaries({ year: initialYear.toString(), month: initialMonth.toString() })
  } catch {
    initialError = false
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