import { Diary } from '@/features/feed/feed.type'
import { DiaryReadOnly } from './diary-readonly'

interface SelectedDateDiaryProps {
  isLoading: boolean
  selectedDate: { year: number; month: number; day: number }
  diary: Diary | null
}

export default function SelectedDateDiary({ isLoading, diary }: SelectedDateDiaryProps) {
  let content

  if (isLoading) {
    content = (
      <div className="h-full flex items-center justify-center text-muted-foreground font-handwritten p-4 text-center text-sm">
        일기를 불러오고 있어요!
      </div>
    )
  } else if (!diary) {
    content = (
      <div className="h-full flex items-center justify-center text-muted-foreground font-handwritten p-4 text-center text-sm">
        선택한 날짜에 일기가 없습니다
      </div>
    )
  } else {
    content = <DiaryReadOnly diary={diary} />
  }
  return <div className="overflow-hidden">{content}</div>
}
