'use client'

import type { Memo } from '@/features/memo/api/memo.action'

import MemoReadOnly from './memo-readonly'

export interface CalendarMemoListProps {
  memos: Memo[]
  isLoading: boolean
}

export default function CalendarMemoList({ memos, isLoading }: CalendarMemoListProps) {
  const isScrollable = memos && memos.length > 6
  if (isLoading && memos?.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground font-handwritten p-4 text-center text-sm ">
        메모를 불러오고 있어요!
      </div>
    )
  }

  if (!isLoading && !memos?.length) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground font-handwritten p-4 text-center text-sm">
        메모가 없습니다
      </div>
    )
  }

  return (
    <div
      className={`max-h-[300px] sm:max-h-[450px] md:max-h-[500px]  lg:max-h-[640px] ${isScrollable ? 'overflow-y-auto' : ''}`}
    >
      <MemoReadOnly memos={memos} isLoading={isLoading} />
    </div>
  )
}
