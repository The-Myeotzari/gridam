'use client'

import { deleteDiary } from '@/app/(main)/action'
import type { FetchDiaryResponseType } from '@/features/feed/feed.type'
import { useDiaryStatusStore } from '@/features/feed/store/diary-status-store'
import { MESSAGES } from '@/shared/constants/messages'
import ClientButton from '@/shared/ui/client-button'
import { ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/modal/modal'
import { modalStore } from '@/store/modal-store'
import { toast } from '@/store/toast-store'
import { useCallback, useTransition } from 'react'

type Props = {
  getPagesSnapshot: () => FetchDiaryResponseType[]
  removeItemById: (id: string) => void
  rollbackPages: (snapshot: FetchDiaryResponseType[]) => void
}

export function useDiaryDeleteModal({ getPagesSnapshot, removeItemById, rollbackPages }: Props) {
  const [isPending, startTransition] = useTransition()

  const openDeleteModal = useCallback(
    (id: string) => {
      modalStore.open((close) => (
        <>
          <ModalHeader>정말 삭제할까요?</ModalHeader>
          <ModalBody className="p-6 text-slate-600">
            삭제 후에는 되돌릴 수 없습니다.
            <br />
            해당 그림일기를 삭제하시겠습니까?
          </ModalBody>
          <ModalFooter className="p-4 flex justify-end gap-2">
            <ClientButton label={MESSAGES.COMMON.CANCEL_BUTTON} onClick={close} />
            <ClientButton
              type="submit"
              label={MESSAGES.COMMON.DELETE_BUTTON}
              className="bg-(--color-background) text-destructive border-destructive hover:bg-destructive hover:text-(--color-destructive-foreground)"
              onClick={() => {
                startTransition(async () => {
                  const snapshot = getPagesSnapshot()
                  removeItemById(id)

                  const res = await deleteDiary(id)

                  if (res.ok) {
                    useDiaryStatusStore.getState().setStatus('none')
                    close()
                    return
                  }

                  rollbackPages(snapshot)
                  toast.error(MESSAGES.DIARY.ERROR.DELETE)
                })
              }}
            />
          </ModalFooter>
        </>
      ))
    },
    [getPagesSnapshot, removeItemById, rollbackPages, startTransition]
  )

  return { openDeleteModal, isDeleting: isPending }
}
