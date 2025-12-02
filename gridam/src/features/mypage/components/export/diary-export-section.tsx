import DiaryExportContainer from '@/features/mypage/components/export/diary-export-container'
import { getMonthlyDiaries } from '@/app/(main)/mypage/action'

export default async function DiaryExportSection() {
  const now = new Date()

  const initialYear = now.getFullYear()
  const initialMonth = now.getMonth() + 1
  const initialMonthly = await getMonthlyDiaries({ year: initialYear.toString(), month: initialMonth.toString() })
  
  return (
    <DiaryExportContainer
      initialYear={initialYear}
      initialMonth={initialMonth}
      initialMonthly={initialMonthly}
    />
  )
}