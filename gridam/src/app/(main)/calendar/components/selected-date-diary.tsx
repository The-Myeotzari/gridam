import DiaryForm from '@/features/diary/components/diary-form'
import DiaryLayout from '@/features/diary/components/diary-layout'
import { Diary } from '@/features/feed/feed.type'
import Button from '@/shared/ui/button'
import { getFormatDate } from '@/shared/utils/get-format-date'
import Link from 'next/link'

interface SelectedDateDiaryProps {
  isLoading: boolean
  selectedDate: { year: number; month: number; day: number }
  diary: Diary | null
}

export default function SelectedDateDiary({
  isLoading,
  selectedDate,
  diary,
}: SelectedDateDiaryProps) {
  let content

  if (isLoading) {
    content = <div>일기를 불러오고 있어요!</div>
  } else if (!diary) {
    content = <div>아직 작성된 일기가 없어요!</div>
  } else {
    // 이미 calendar API에서 받은 diary 객체 사용
    const dateValue = diary.date // "2025-11-26" 이런 형태라고 가정
    const formattedDate = getFormatDate(dateValue)
    const weatherIcon = diary.emoji ?? '/fallback-weather.png'

    content = (
      <DiaryLayout date={formattedDate} weatherIcon={weatherIcon}>
        {/* 읽기 전용 느낌으로 쓰고 싶으면 isEdit={false}로 바꿔도 됨 */}
        <DiaryForm dateValue={dateValue} isEdit={false} diary={diary} />

        <div className="mt-4 flex justify-end">
          <Link href={`/diary/${diary.id}`}>
            <Button label="전체 화면에서 보기" />
          </Link>
        </div>
      </DiaryLayout>
    )
  }
  return <div>{content}</div>
}
