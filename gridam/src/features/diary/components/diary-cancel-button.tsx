import DiaryFormButton from '@/features/diary/components/diary-form-button'
import { DIARY_STATUS, type DiaryStatus } from '@/features/diary/types/diary.type'
import { MESSAGES } from '@/shared/constants/messages'
import { URL_CONSTANTS } from '@/shared/constants/url.constants'
import ClientButton from '@/shared/ui/client-button'
import { ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/modal/modal'
import { modalStore } from '@/store/modal-store'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export default function DiaryCancelButton({ status }: { status: DiaryStatus }) {
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
            type="button"
            className="bg-black text-white px-3 py-2 rounded"
            onClick={(e) => {
              e.preventDefault()
              close()
              if (status === DIARY_STATUS.NEW || status === DIARY_STATUS.PUBLISHED) {
                router.push(URL_CONSTANTS.HOME)
              } else {
                router.push(URL_CONSTANTS.DRAFT)
              }
            }}
            label={MESSAGES.COMMON.CONFIRM}
          />
        </ModalFooter>
      </>
    ))
  }, [router, status])

  return (
    <DiaryFormButton label={MESSAGES.COMMON.CANCEL_BUTTON} type="button" onClick={handleCancel} />
  )
}
