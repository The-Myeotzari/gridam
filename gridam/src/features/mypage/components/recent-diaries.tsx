import { Card, CardBody, CardHeader } from '@/shared/ui/card'
import { RecentDiary } from '@/features/mypage/types/mypage'
import DiaryCard from './diary-card'

interface RecentDiariesProps {
  diaries: RecentDiary[]
}

export default function RecentDiaries({ diaries }: RecentDiariesProps) {
  const hasDiaries: boolean = diaries.length > 0

  return (
    <Card className='w-full'>
      <CardHeader
        align="horizontal"
        cardTitle={<span className='text-lg sm:text-xl'>최근 일기</span>}
        cardDescription={<span className='text-sm'>최근에 작성한 일기 목록</span>}
        className='text-xl'
      />
      <CardBody className="flex flex-col gap-2">
        {hasDiaries ?
          diaries.map((diary) => (
            <DiaryCard key={diary.id} diary={diary} />
          ))
          :
          <p className="text-sm text-muted-foreground text-center py-4">
            아직 작성한 일기가 없어요.
          </p>
        }
      </CardBody>
    </Card>
  )
}
