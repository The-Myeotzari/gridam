'use client'

import DiaryCancelButton from '@/features/diary/components/diary-cancel-button'
import DiaryFormButton from '@/features/diary/components/diary-form-button'
import { MESSAGES } from '@/shared/constants/messages'

export const DIARY_STATUS = {
  NEW: 'new',
  DRAFT: 'draft',
  PUBLISHED: 'published',
} as const

export type DiaryStatus = (typeof DIARY_STATUS)[keyof typeof DIARY_STATUS]

type DiaryFormButtonsProps = {
  status: DiaryStatus
  isPending: boolean
  onSave: () => void
  onUpdate: () => void
  onTempSave: () => void
  onTempUpdate: () => void
}

export default function DiaryFormButtons({
  status,
  isPending,
  onSave,
  onUpdate,
  onTempSave,
  onTempUpdate,
}: DiaryFormButtonsProps) {
  return (
    <div className="text-center mb-4">
      {/* 취소 */}
      <DiaryCancelButton />

      {/* 수정: 발행된 글 */}
      {status === DIARY_STATUS.PUBLISHED && (
        <DiaryFormButton
          label={MESSAGES.COMMON.UPDATE_BUTTON}
          type="button"
          variant="blue"
          isPending={isPending}
          onClick={onUpdate}
          className="ml-2"
        />
      )}

      {/* 임시 저장: 신규 */}
      {status === DIARY_STATUS.NEW && (
        <DiaryFormButton
          label={MESSAGES.COMMON.DRAFT_SAVE_BUTTON}
          type="button"
          isPending={isPending}
          onClick={onTempSave}
          className="ml-2"
        />
      )}

      {/* 임시 수정: 임시 저장된 글만 */}
      {status === DIARY_STATUS.DRAFT && (
        <DiaryFormButton
          label={MESSAGES.COMMON.DRAFT_UPDATE_BUTTON}
          type="button"
          isPending={isPending}
          onClick={onTempUpdate}
          className="ml-2"
        />
      )}

      {/* 저장: 신규 작성 / 임시 저장 */}
      {(status === DIARY_STATUS.NEW || status === DIARY_STATUS.DRAFT) && (
        <DiaryFormButton
          label={MESSAGES.COMMON.SAVE_BUTTON}
          type="button"
          variant="blue"
          isPending={isPending}
          className="ml-2"
          onClick={onSave}
        />
      )}
    </div>
  )
}
