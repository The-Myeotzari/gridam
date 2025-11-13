'use client'

import { ModalBody, ModalFooter, ModalHeader } from '@/components/ui/modal/modal'
import Textarea from '@/components/ui/textarea'
import { MESSAGES } from '@/constants/messages'
import { usePostDiaryImage } from '@/features/write//api/queries/use-post-diary-image'
import { postDiaryAction } from '@/features/write/api/action/post-diary-action'
import { usePostDiary } from '@/features/write/api/queries/use-post-diary'
import CanvasContainer from '@/features/write/components/canvas-container'
import WriteButton from '@/features/write/components/write-button'
import { useSetDate, useSetText } from '@/features/write/store/write-store'
import { modalStore } from '@/store/modal-store'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'

type props = {
  today: string
  dateValue: string
  weather: string
}

export default function WriteForm({ today, dateValue, weather }: props) {
  const router = useRouter()

  const setDate = useSetDate()
  const setText = useSetText()

  const { mutate: createDiary, isPending: createIsPending } = usePostDiary()
  const { mutateAsync: uploadImage, isPending: uploadIsPending } = usePostDiaryImage()

  useEffect(() => {
    if (today) {
      setDate(today)
    }
  }, [today, setDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await postDiaryAction({
      date: dateValue,
      weather,
      createIsPending,
      uploadIsPending,
      createDiary,
      uploadImage,
    })
  }

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
    <form onSubmit={handleSubmit}>
      <CanvasContainer />

      <section className="p-5">
        <Textarea onChange={(v) => setText(v)} />
      </section>

      <div className="text-center mb-4">
        <span onClick={handleCancel} className="mr-2">
          <WriteButton label={MESSAGES.COMMON.CANCEL_BUTTON} type="button" />
        </span>
        <WriteButton
          label={MESSAGES.COMMON.SAVE_BUTTON}
          type="submit"
          variant="blue"
          isPending={createIsPending || uploadIsPending}
          className="ml-2"
        />
      </div>
    </form>
  )
}
