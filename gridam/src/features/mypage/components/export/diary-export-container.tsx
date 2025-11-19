'use client'

import { useState } from 'react'
import DiaryExportCard from '@/features/mypage/components/export/diary-export-card'
import { useMonthlyDiaries } from '@/features/mypage/api/queries/use-monthly-diaries'
import { modalStore } from '@/store/modal-store'
import { DiaryExportPreviewModal } from '@/features/mypage/components/export/diary-export-preview-modal'
import { Diary } from '@/features/feed/types/feed'

type MyPageDiaryExportContainerProps = {
  initialYear: number
  initialMonth: number
  initialMonthly: {
    year: number
    month: number
    diaries: Diary[]
  }
}

export default function DiaryExportContainer({
  initialYear,
  initialMonth,
  initialMonthly,
}: MyPageDiaryExportContainerProps) {
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)

    const { data, isLoading } = useMonthlyDiaries(year, month, {
    initialData:
      year === initialYear && month === initialMonth
        ? initialMonthly
        : undefined,
  })

  const diaries = data?.diaries ?? []
  const diaryCount = diaries.length

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
    if (!data || diaryCount === 0) return

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
      onPrevYear={handlePrevYear}
      onNextYear={handleNextYear}
      onSelectMonth={handleSelectMonth}
      onPreview={handleOpenPreview}
    />
  )
}