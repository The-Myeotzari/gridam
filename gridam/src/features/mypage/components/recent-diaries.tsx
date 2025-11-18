'use client'

import { Card, CardBody, CardHeader } from '@/shared/ui/card'
import DropBox from '@/shared/ui/dropbox'
import { RecentDiary } from '../types/mypage'
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
        cardTitle="최근 일기"
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
              cardImage={<Image src={diary.emoji} alt='날씨' width={40} height={40} />}
              cardTitle={diary.date}
              cardDescription={diary.weekday}
              right={<DropBox
                id={diary.id}
                onEdit={() => handleEdit(diary.id)}
                onDelete={() => {
                  console.log('삭제 모달 오픈')
                }}
              />}
              iconSize="sm"
            />
            <CardBody className="flex flex-col gap-1 pt-1">
              <p className="truncate">{diary.content}</p>
              <span className="text-sm text-muted-foreground">
                {diary.time}
              </span>
            </CardBody>
          </Card>
        ))}
      </CardBody>
    </Card>
  )
}
