import { Card, CardBody, CardHeader } from '@/components/ui/card'
import DropBox from '@/components/ui/dropbox'

interface RecentDiary {
  id: string
  date: string
  weekday: string
  time: string
  content: string
  weatherIcon: React.ReactNode
}

interface RecentDiariesProps {
  diaries: RecentDiary[]
}

export default function RecentDiaries({ diaries }: RecentDiariesProps) {
  const hasDiaries: boolean = diaries.length > 0

  return (
    <section className="w-full">
      <Card>
        <CardHeader
          align="horizontal"
          cardTitle="최근 일기"
          cardDescription={<span className='text-sm'>최근에 작성한 일기 목록</span>}
          className='text-xl'
        />
        <CardBody className="flex flex-col gap-2">
          {hasDiaries ? (
            diaries.map((diary) => (
              <Card
                key={diary.id}
                hoverable
                indent="sm"
                className="shadow-none"
              >
                <CardHeader
                  align="horizontal"
                  cardImage={diary.weatherIcon}
                  cardTitle={
                    <>
                      <p>{diary.date}</p>
                      <p className="text-sm text-muted-foreground">
                        {diary.weekday}
                      </p>
                    </>
                  }
                  right={<DropBox id={diary.id} />}
                  iconSize="sm"
                />
                <CardBody className="flex flex-col gap-1 pt-1">
                  <p className="truncate">{diary.content}</p>
                  <span className="text-sm text-muted-foreground">
                    {diary.time}
                  </span>
                </CardBody>
              </Card>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              아직 작성한 일기가 없어요.
            </p>
          )}
        </CardBody>
      </Card>
    </section>
  )
}