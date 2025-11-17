'use client'

import { ModalBody, ModalFooter, ModalHeader } from '@/components/ui/modal/modal'
import Textarea from '@/components/ui/textarea'
import { MESSAGES } from '@/constants/messages'
import { postDiaryAction } from '@/features/diary-detail/api/action/post-diary-action'
import { usePostDiary } from '@/features/diary-detail/api/queries/use-post-diary'
import { usePostDiaryImage } from '@/features/diary-detail/api/queries/use-post-diary-image'
import CanvasContainer from '@/features/diary-detail/components/canvas/canvas-container'
import DiaryFormButton from '@/features/diary-detail/components/diary-form-button'
import { useCanvas, useSetCanvas } from '@/features/diary-detail/store/canvas-store'
import { useSetDate, useSetText, useText } from '@/features/diary-detail/store/write-store'
import { modalStore } from '@/store/modal-store'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import { useUpdateDiary } from '../api/queries/use-update-diary'

type props = {
  dateValue: string
  weather: string

  isEdit?: boolean
  diaryId?: string
  initialContent?: string
  initialImage?: string | null
}

export default function DiaryForm({
  dateValue,
  weather,
  isEdit = false,
  diaryId,
  initialContent,
  initialImage,
}: props) {
  const router = useRouter()

  const setDate = useSetDate()
  const setText = useSetText()
  const setCanvas = useSetCanvas()
  const text = useText()
  const canvas = useCanvas()

  const { mutate: createDiary, isPending: createPending } = usePostDiary()
  const { mutateAsync: uploadImage, isPending: uploadPending } = usePostDiaryImage()
  const { mutate: updateDiaryMutate, isPending: updatePending } = useUpdateDiary()

  useEffect(() => {
    setDate(dateValue)
    if (initialContent) {
      setText(initialContent)
    }
    if (initialImage) {
      setCanvas(initialImage)
    }
  }, [dateValue, initialContent, initialImage, setDate, setText, setCanvas])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isEdit && diaryId) {
      updateDiaryMutate({
        id: diaryId,
        text,
        canvas,
        uploadImage,
      })
      return
    }

    await postDiaryAction({
      date: dateValue,
      weather,
      createIsPending: createPending,
      uploadIsPending: uploadPending,
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
      <CanvasContainer initialImage={initialImage} />

      <section className="p-5">
        <Textarea value={text} onChange={(v) => setText(v)} />
      </section>

      <div className="text-center mb-4">
        <span onClick={handleCancel} className="mr-2">
          <DiaryFormButton label="취소" type="button" />
        </span>

        <DiaryFormButton
          label={isEdit ? '수정하기' : '저장하기'}
          type="submit"
          variant="blue"
          isPending={createPending || uploadPending || updatePending}
          className="ml-2"
        />
      </div>
    </form>
  )
}
