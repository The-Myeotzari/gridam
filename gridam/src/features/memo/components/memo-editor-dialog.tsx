'use client'

import { useEffect, useState } from 'react'
import Button from '@/shared/ui/button'
import Input from '@/shared/ui/input'
import { toast } from '@/store/toast-store'
import { MESSAGES } from '@/shared/constants/messages'
import {
  createMemoAction,
  updateMemoAction,
  type Memo,
  type CreateMemoInput,
  type UpdateMemoInput,
} from '@/features/memo/api/memo.action'
import MarkdownEditor from './markdown-editor'
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/modal/modal'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialMemo?: Memo | null
  onSuccess?: () => void
}

export default function MemoEditorDialog({ open, onOpenChange, initialMemo, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const isEditMode = Boolean(initialMemo)

  useEffect(() => {
    if (open) {
      setContent(initialMemo?.content ?? '')
    }
  }, [open, initialMemo])

  function handleClose() {
    onOpenChange(false)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const title = String(formData.get('title') ?? '').trim()

    if (!title && !content.trim()) {
      const msg = isEditMode
        ? MESSAGES.MEMO.ERROR.UPDATE_NO_DATA
        : MESSAGES.MEMO.ERROR.CREATE_NO_DATA

      toast.error(msg ?? '제목 또는 내용을 입력해주세요.')
      return
    }

    setLoading(true)

    try {
      if (isEditMode && initialMemo) {
        const payload: UpdateMemoInput = {
          id: initialMemo.id,
          title,
          content,
        }

        const result = await updateMemoAction(payload)

        if (!result.ok) {
          toast.error(result.message ?? MESSAGES.MEMO.ERROR.UPDATE)
          return
        }

        toast.success(MESSAGES.MEMO.SUCCESS.UPDATE)
      } else {
        const payload: CreateMemoInput = {
          title,
          content,
        }

        const result = await createMemoAction(payload)

        if (!result.ok) {
          toast.error(result.message ?? MESSAGES.MEMO.ERROR.CREATE)
          return
        }

        toast.success(MESSAGES.MEMO.SUCCESS.CREATE)
      }

      onSuccess?.()
      handleClose()
    } catch {
      toast.error(isEditMode ? MESSAGES.MEMO.ERROR.UPDATE : MESSAGES.MEMO.ERROR.CREATE)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="2xl"
      closeOnBackdrop
      closeOnEscape
      className="bg-background w-full max-w-5xl"
    >
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <ModalHeader className="flex items-center justify-between px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">
            {isEditMode ? '메모 수정' : '새 메모'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-sm text-muted-foreground hover:opacity-70"
          >
            닫기
          </button>
        </ModalHeader>

        <ModalBody className="space-y-4 bg-background px-6 py-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground" htmlFor="memo-title">
              제목
            </label>
            <Input
              id="memo-title"
              name="title"
              defaultValue={initialMemo?.title ?? ''}
              placeholder="제목을 입력하세요"
              className="w-full"
            />
          </div>

          <MarkdownEditor value={content} onChange={setContent} />
        </ModalBody>

        <ModalFooter className="flex justify-end gap-2 px-6 py-4">
          <div onClick={handleClose}>
            <Button type="button" variant="roundedBasic" label="취소" disabled={loading} />
          </div>

          <Button
            type="submit"
            variant="blue"
            label={isEditMode ? '수정하기' : '저장하기'}
            disabled={loading}
          />
        </ModalFooter>
      </form>
    </Modal>
  )
}
