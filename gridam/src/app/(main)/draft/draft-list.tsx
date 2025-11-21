'use client'

import { deleteDraftAction } from '@/app/(main)/draft/actions'
import type { Diary } from '@/features/feed/feed.type'
import { MESSAGES } from '@/shared/constants/messages'
import { Card, CardBody, CardFooter, CardHeader } from '@/shared/ui/card'
import DropBox from '@/shared/ui/dropbox'
import { formatDate } from '@/shared/utils/format-date'
import { toast } from '@/store/toast-store'
import { useRouter } from 'next/navigation'
import { useOptimistic, useState, useTransition } from 'react'

export default function DraftList({ initialDrafts }: { initialDrafts: Diary[] }) {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [drafts, optimisticDelete] = useOptimistic<Diary[], string | null>(
    initialDrafts,
    (state, idToDelete) => state.filter((item) => item.id !== idToDelete)
  )

  const handleDelete = (id: string) => {
    optimisticDelete(id)
    setDeletingId(id)

    startTransition(async () => {
      try {
        await deleteDraftAction(id)
        toast.success(MESSAGES.DIARY.SUCCESS.DELETE)
      } catch (err) {
        toast.error(MESSAGES.DIARY.ERROR.DRAFT_DELETE)
        optimisticDelete(null)
      } finally {
        setDeletingId(null)
      }
    })
  }

  const handleEdit = (id: string) => router.push(`/${id}`)

  return (
    <div>
      {drafts.length === 0 && <p>임시 글이 없습니다.</p>}
      {/* TODO: 카드 전용 컴포넌트로 분리하기 */}
      {drafts.map((diary) => {
        const isDeleting = isPending && deletingId === diary.id
        return (
          <Card
            key={diary.id}
            // TODO: 추후 스피너로 교체 필요
            className={`
              flex flex-col gap-4 sm:w-xl md:w-2xl mx-auto mb-4
              transition-opacity duration-300 ${
                isDeleting ? 'opacity-50 pointer-events-none' : ''
              }`}
          >
            <CardHeader
              cardTitle={diary.date}
              right={
                <DropBox
                  id={diary.id}
                  onEdit={() => handleEdit(diary.id)}
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
        )
      })}
    </div>
  )
}
