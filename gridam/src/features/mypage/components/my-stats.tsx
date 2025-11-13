// app/mypage/_components/stats-section.tsx
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Calendar, NotebookPen } from 'lucide-react'

interface MyStatsProps {
  totalDiaries: number
  totalDays: number
}

export default function MyStats({ totalDiaries, totalDays }: MyStatsProps) {
  return (
    <section className="w-full grid grid-cols-2 gap-6">
      <Card className="w-full">
        <CardHeader
          cardImage={
            <div className='p-4 rounded-full bg-primary/30'>
              <NotebookPen className='text-primary' />
            </div>
          }
          cardDescription="작성한 일기"
        />
        <CardBody className="text-center text-2xl font-bold">
          {totalDiaries}
        </CardBody>
      </Card>
      <Card className="w-full">
        <CardHeader
          cardImage={
            <div className='p-4 rounded-full bg-secondary/30'>
              <Calendar />
            </div>
          }
          cardDescription="작성 일수"
        />
        <CardBody className="text-center text-2xl font-bold">
          {totalDays}일
        </CardBody>
      </Card>
    </section>
  )
}