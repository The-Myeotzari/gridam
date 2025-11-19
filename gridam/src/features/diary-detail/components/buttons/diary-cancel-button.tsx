import DiaryFormButton from '@/features/diary-detail/components/diary-form-button'
import { MESSAGES } from '@/shared/constants/messages'
import { ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/modal/modal'
import { modalStore } from '@/store/modal-store'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export default function DiaryCancelButton() {
  const router = useRouter()

  const handleCancel = useCallback(() => {
    modalStore.open((close) => (
      <>
        <ModalHeader>{MESSAGES.DIARY.CANCEL.TITLE}</ModalHeader>
        <ModalBody className="p-6 text-slate-600">{MESSAGES.DIARY.CANCEL.DESCRIPTION}</ModalBody>
        <ModalFooter className="p-4 flex justify-end gap-2">
          <button className="border px-3 py-2 rounded" onClick={close}>
            {MESSAGES.COMMON.CANCEL}
          </button>
          <button
            className="bg-black text-white px-3 py-2 rounded"
            onClick={() => {
              router.back()
              close()
            }}
          >
            {MESSAGES.COMMON.CONFIRM}
          </button>
        </ModalFooter>
      </>
    ))
  }, [router])

  return (
    <span onClick={handleCancel} className="mr-2">
      <DiaryFormButton label={MESSAGES.COMMON.CANCEL_BUTTON} type="button" />
    </span>
  )
}
