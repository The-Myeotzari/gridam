'use client'

import { MESSAGES } from '@/shared/constants/messages'
import Button from '@/shared/ui/button'

type Props = {
  onRetry: () => void
  isLoading?: boolean
}

export default function FeedListError({ onRetry, isLoading }: Props) {
  return (
    <div className="flex flex-col items-center gap-2 text-lg">
      <p>{MESSAGES.DIARY.ERROR.READ}</p>
      <span onClick={onRetry}>
        <Button label={isLoading ? '다시 시도 중...' : '다시 시도'} disabled={isLoading} />
      </span>
    </div>
  )
}
