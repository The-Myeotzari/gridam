import DiaryExportContainer from '@/features/mypage/components/export/diary-export-container'
import { getMonthlyDiaries } from '@/features/mypage/api/get-monthly-diary.api'

export default async function DiaryExportSection() {
  const now = new Date()

  const initialYear = now.getFullYear()
  const initialMonth = now.getMonth() + 1
  const initialMonthly = await getMonthlyDiaries({ year: initialYear, month: initialMonth })
  
  return (
    <DiaryExportContainer
      initialYear={initialYear}
      initialMonth={initialMonth}
      initialMonthly={initialMonthly}
    />
  )
}