'use client'

import Button from '@/components/ui/button'
import { ModalBody, ModalFooter, ModalHeader } from '@/components/ui/modal/modal'
import { MESSAGES } from '@/constants/messages'
import { useDeleteDiary } from '@/features/feed/api/use-delete-diary'
import { modalStore } from '@/store/modal-store'
import { useCallback } from 'react'

export default function useDeleteDiaryModal(diaryId: string) {
  const { mutateAsync } = useDeleteDiary()

  const openDeleteModal = useCallback(() => {
    modalStore.open((close) => (
      <>
        <ModalHeader>정말 삭제할까요?</ModalHeader>

        <ModalBody className="p-6 text-slate-600">
          삭제 후에는 되돌릴 수 없습니다.
          <br />
          해당 그림일기를 삭제하시겠습니까?
        </ModalBody>

        <ModalFooter className="p-4 flex justify-end gap-2">
          <span onClick={close}>
            <Button label={MESSAGES.COMMON.CANCEL_BUTTON} />
          </span>

          <span
            onClick={async () => {
              await mutateAsync(diaryId)
              close()
            }}
          >
            <Button
              type="submit"
              label={MESSAGES.COMMON.DELETE_BUTTON}
              className="bg-(--color-background) text-destructive border-destructive hover:bg-destructive hover:text-(--color-destructive-foreground)"
            />
          </span>
        </ModalFooter>
      </>
    ))
  }, [diaryId, mutateAsync])

  return openDeleteModal
}
