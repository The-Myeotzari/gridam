'use client'

import { useState } from 'react'
import DiaryExportCard from '@/features/mypage/components/export/diary-export-card'

type DiaryExportCardContainerProps = {
  initialYear: number
  initialMonth: number
  initialDiaryCount: number
}

export default function DiaryExportCardContainer({
  initialYear,
  initialMonth,
  initialDiaryCount,
}: DiaryExportCardContainerProps) {
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)
  const [diaryCount, setDiaryCount] = useState(initialDiaryCount)
  const [isExporting, setIsExporting] = useState(false)

  // TODO: React Query로 교체 가능
  const refetchDiaryCount = async (nextYear: number, nextMonth: number) => {
    // const res = await fetch(`/apis/diaries/count?year=${nextYear}&month=${nextMonth}`)
    // const data = await res.json()
    // setDiaryCount(data.count)
  }

  const handlePrevYear = async () => {
    const nextYear = year - 1
    setYear(nextYear)
    await refetchDiaryCount(nextYear, month)
  }

  const handleNextYear = async () => {
    const nextYear = year + 1
    setYear(nextYear)
    await refetchDiaryCount(nextYear, month)
  }

  const handleSelectMonth = async (nextMonth: number) => {
    setMonth(nextMonth)
    await refetchDiaryCount(year, nextMonth)
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)
      // TODO: PDF export API 호출
      // const res = await fetch(`/apis/diaries/export-pdf`, { method: 'POST', body: JSON.stringify({ year, month }) })
      // blob 받아서 다운로드 처리 or 서버에서 바로 다운로드 응답
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DiaryExportCard
      year={year}
      month={month}
      diaryCount={diaryCount}
      isExporting={isExporting}
      onPrevYear={handlePrevYear}
      onNextYear={handleNextYear}
      onSelectMonth={handleSelectMonth}
      onExport={handleExport}
    />
  )
}