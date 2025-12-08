import { Diary } from '@/features/feed/feed.type'
import { DiaryReadOnly } from './diary-readonly'

interface SelectedDateDiaryProps {
  isLoading: boolean
  selectedDate: { year: number; month: number; day: number }
  diary: Diary
}

export default function SelectedDateDiary({ isLoading, diary }: SelectedDateDiaryProps) {
  //로딩 중일 때
  if (isLoading && !diary.id) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground font-handwritten p-4 text-center text-sm">
        일기를 불러오고 있어요!
      </div>
    )
  }
  //로딩 중이 아니고 일기가 없을 때
  if (!diary.id) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground font-handwritten p-4 text-center text-sm">
        선택한 날짜에 일기가 없습니다
      </div>
    )
  }
  //로딩 중이 아니고 일기가 있을 때
  return <DiaryReadOnly diary={diary} />
}
