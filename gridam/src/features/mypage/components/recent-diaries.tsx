'use client'

import { Card, CardBody, CardHeader } from '@/shared/ui/card'
import DropBox from '@/shared/ui/dropbox'
import { RecentDiary } from '@/features/mypage/types/mypage'
import Image from 'next/image'
import { redirect } from 'next/navigation'

interface RecentDiariesProps {
  diaries: RecentDiary[]
}

export default function RecentDiaries({ diaries }: RecentDiariesProps) {

  const handleEdit = (id: string) => {
    // 다이어리 수정 페이지 이동
    redirect(`/${id}`)
  }

  const handleDelete = async () => {
    // 실제 삭제 API 호출
  }

  return (
    <Card>
      <CardHeader
        align="horizontal"
        cardTitle={<span className='text-lg sm:text-xl'>최근 일기</span>}
        cardDescription={<span className='text-sm'>최근에 작성한 일기 목록</span>}
        className='text-xl'
      />
      <CardBody className="flex flex-col gap-2">
        {diaries.map((diary) => (
          <Card
            key={diary.id}
            hoverable
            indent="sm"
            className="shadow-none"
          >
            <CardHeader
              align="horizontal"
              cardImage={
                <div className='p-1 rounded-full bg-primary/20'>
                  <Image src={diary.emoji} alt='날씨' width={40} height={40} />
                </div>
              }
              cardTitle={<span className='text-sm sm:text-base'>{diary.date}</span>}
              cardDescription={<span className='text-sm sm:text-base'>{diary.weekday}</span>}
              right={<DropBox
                id={diary.id}
                onEdit={() => handleEdit(diary.id)}
                onDelete={() => handleDelete()}
              />}
              iconSize="sm"
            />
            <CardBody className="flex flex-col gap-1 pt-1">
              <p className="text-sm sm:text-base truncate">{diary.content}</p>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {diary.time}
              </span>
            </CardBody>
          </Card>
        ))}
      </CardBody>
    </Card>
  )
}
