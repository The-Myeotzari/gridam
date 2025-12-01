import DiaryFormButton from '@/features/diary/components/diary-form-button'
import { MESSAGES } from '@/shared/constants/messages'
import ClientButton from '@/shared/ui/client-button'
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
          <ClientButton
            className="border px-3 py-2 rounded"
            onClick={close}
            label={MESSAGES.COMMON.CANCEL}
          />
          <ClientButton
            className="bg-black text-white px-3 py-2 rounded"
            onClick={() => {
              router.back()
              close()
            }}
            label={MESSAGES.COMMON.CONFIRM}
          />
        </ModalFooter>
      </>
    ))
  }, [router])

  return (
    <DiaryFormButton label={MESSAGES.COMMON.CANCEL_BUTTON} type="button" onClick={handleCancel} />
  )
}
