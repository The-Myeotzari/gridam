import { getDiary } from '@/app/(main)/(diary)/[id]/action'
import DiaryForm from '@/features/diary-detail/components/diary-form'
import DiaryLayout from '@/features/diary-detail/components/diary-layout'
import { formatDate } from '@/shared/utils/format-date'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const diary = await getDiary(id)

  const dateValue = diary.date
  const formattedDate = formatDate(dateValue)
  // 날씨 예외처리 고민 필요 - 기본이미지 출력?
  const weatherIcon = diary.emoji ?? '/fallback-weather.png'

  return (
    <DiaryLayout date={formattedDate} weatherIcon={weatherIcon}>
      <DiaryForm
        dateValue={dateValue}
        isEdit={true}
        diaryId={diary.id}
        initialContent={diary.content}
        initialImage={diary.image_url}
      />
    </DiaryLayout>
  )
}
