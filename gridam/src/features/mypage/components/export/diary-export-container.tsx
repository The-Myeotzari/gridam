'use client'

import { useState } from 'react'
import DiaryExportCard from '@/features/mypage/components/export/diary-export-card'
import { useMonthlyDiaries } from '@/features/mypage/api/queries/use-monthly-diaries'
import { modalStore } from '@/store/modal-store'
import { DiaryExportPreviewModal } from '@/features/mypage/components/export/diary-export-preview-modal'
import { Diary, MonthlyDiaries } from '@/features/mypage/types/mypage'

type MyPageDiaryExportContainerProps = {
  initialYear: number
  initialMonth: number
  initialMonthly: MonthlyDiaries | null
  initialError: boolean
}

export default function DiaryExportContainer({
  initialYear,
  initialMonth,
  initialMonthly,
  initialError,
}: MyPageDiaryExportContainerProps) {
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)
  const { data, isLoading, isError, refetch } = useMonthlyDiaries(year, month, {
    initialData:
      year === initialYear && month === initialMonth
        ? initialMonthly ? initialMonthly : undefined
        : undefined,
  })

  const diaries: Diary[] = data?.diaries ?? []
  const diaryCount: number = diaries.length
  const hasError: boolean = initialError || isError

  const handlePrevYear = () => {
    const nextYear = year - 1
    setYear(nextYear)
  }

  const handleNextYear = () => {
    const nextYear = year + 1
    setYear(nextYear)
  }

  const handleSelectMonth = (nextMonth: number) => {
    setMonth(nextMonth)
  }

  const handleOpenPreview = () => {
    if (isError || !data || diaryCount === 0) return

    modalStore.open((close) => (
      <DiaryExportPreviewModal
        year={year}
        month={month}
        diaries={diaries}
        onClose={close}
      />
    ))
  }

  return (
    <DiaryExportCard
      year={year}
      month={month}
      diaryCount={diaryCount}
      isLoading={isLoading}
      isError={hasError}
      onPrevYear={handlePrevYear}
      onNextYear={handleNextYear}
      onSelectMonth={handleSelectMonth}
      onPreview={handleOpenPreview}
      onRetry={refetch}
    />
  )
}