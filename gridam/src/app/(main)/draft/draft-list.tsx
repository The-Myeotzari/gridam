'use client'

import { deleteDraftAction } from '@/app/(main)/draft/actions'
import type { Diary } from '@/features/feed/feed.type'
import { MESSAGES } from '@/shared/constants/messages'
import { Card, CardBody, CardFooter, CardHeader } from '@/shared/ui/card'
import ClientButton from '@/shared/ui/client-button'
import DropBox from '@/shared/ui/dropbox'
import { ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/modal/modal'
import { getFormatDateTime } from '@/shared/utils/date'
import { modalStore } from '@/store/modal-store'
import { toast } from '@/store/toast-store'
import { useRouter } from 'next/navigation'
import { useOptimistic, useState, useTransition } from 'react'

export default function DraftList({ initialDrafts }: { initialDrafts: Diary[] }) {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [drafts, updateOptimistic] = useOptimistic<Diary[], string | Diary[]>(
    initialDrafts,
    (state, input) => {
      if (typeof input === 'string') {
        return state.filter((item) => item.id !== input)
      }
      return input
    }
  )

  const openDeleteModal = (id: string) => {
    modalStore.open((close) => (
      <>
        <ModalHeader>정말 삭제할까요?</ModalHeader>
        <ModalBody className="p-6 text-slate-600">
          삭제 후에는 되돌릴 수 없습니다.
          <br />
          해당 임시 저장 글을 삭제하시겠습니까?
        </ModalBody>
        <ModalFooter className="p-4 flex justify-end gap-2">
          <ClientButton label={MESSAGES.COMMON.CANCEL_BUTTON} onClick={close} />

          <ClientButton
            type="submit"
            label={MESSAGES.COMMON.DELETE_BUTTON}
            className="bg-(--color-background) text-destructive border-destructive 
                       hover:bg-destructive hover:text-(--color-destructive-foreground)"
            onClick={() => {
              startTransition(async () => {
                const previousDrafts = [...drafts]

                updateOptimistic(id)
                setDeletingId(id)

                const res = await deleteDraftAction(id)

                if (res.ok) {
                  toast.success(MESSAGES.DIARY.SUCCESS.DELETE)
                } else {
                  // 롤백
                  updateOptimistic(previousDrafts)
                  toast.error(MESSAGES.DIARY.ERROR.DRAFT_DELETE)
                }

                setDeletingId(null)
                close()
              })
            }}
          />
        </ModalFooter>
      </>
    ))
  }

  const handleEdit = (id: string) => router.push(`/${id}`)

  return (
    <div>
      {drafts.length === 0 && <p>임시 글이 없습니다.</p>}
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
                  onDelete={() => openDeleteModal(diary.id)}
                />
              }
              align="horizontal"
              className="text-muted-foreground text-left"
            />
            <CardBody className="text-left text-muted-foreground text-sm line-clamp-3">
              {diary.content}
            </CardBody>
            <CardFooter className="text-muted-foreground text-sm">
              저장: {getFormatDateTime(diary.updated_at)}
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
