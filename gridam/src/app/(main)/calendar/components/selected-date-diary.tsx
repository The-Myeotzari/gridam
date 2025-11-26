import { Diary } from '@/features/feed/feed.type'

interface SelectedDateDiaryProps {
  isLoading: boolean
  selectedDate: { year: number; month: number; day: number }
  diary: any
}

export default function SelectedDateDiary({
  isLoading,
  selectedDate,
  diary,
}: SelectedDateDiaryProps) {
  return (
    <div>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi dolores alias voluptatem
      pariatur omnis quibusdam tenetur sapiente rerum, optio blanditiis nobis fugit tempora
      consectetur fugiat vitae asperiores quaerat? Reiciendis, dignissimos! Lorem ipsum dolor sit,
      amet consectetur adipisicing elit. Eligendi dolores alias voluptatem pariatur omnis quibusdam
      tenetur sapiente rerum, optio blanditiis nobis fugit tempora consectetur fugiat vitae
      asperiores quaerat? Reiciendis, dignissimos!
    </div>
  )
}
