'use client'

import { Diary } from '@/features/feed/types/feed'
import { Card, CardBody, CardFooter, CardHeader } from '@/shared/ui/card'
import DropBox from '@/shared/ui/dropbox'
import { formatDate } from '@/shared/utils/format-date'

export default function DraftList({ initialDrafts }: { initialDrafts: Diary[] }) {
  const handleDelete = (id: string) => {
    // 삭제 처리 로직
  }

  const handleEdit = () => {
    // 수정 처리 로직
  }

  return (
    <div>
      {initialDrafts.length === 0 && <p>임시 글이 없습니다.</p>}
      <div className="flex flex-col gap-4 p-4 mt-10 text-center">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="font-bold text-4xl mb-2 text-navy-gray">임시 글 목록</h1>
          <p className="font-bold text-xl text-muted-foreground">
            작성 중이던 일기를 불러올 수 있어요
          </p>
        </div>
        {initialDrafts.map((diary) => (
          <div className="flex flex-col gap-4 sm:w-xl md:w-2xl mx-auto" key={diary.id}>
            <Card>
              <CardHeader
                cardTitle={diary.date}
                right={
                  <DropBox
                    id={diary.id}
                    onEdit={() => handleEdit()}
                    onDelete={() => handleDelete(diary.id)}
                  />
                }
                align="horizontal"
                className="text-muted-foreground text-left"
              />
              <CardBody className="text-left text-muted-foreground text-sm line-clamp-3">
                {diary.content}
              </CardBody>
              <CardFooter className="text-muted-foreground text-sm">
                저장: {formatDate(diary.updated_at)}
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
