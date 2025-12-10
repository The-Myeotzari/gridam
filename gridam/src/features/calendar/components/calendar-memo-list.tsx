'use client'

import type { Memo } from '@/features/memo/api/memo.action'
import { Card } from '@/shared/ui/card'
import cn from '@/shared/utils/cn'
import { FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface CalendarMemoList {
  memos: Memo[]
  isLoading: boolean
}

export default function CalendarMemoList({ memos, isLoading }: CalendarMemoList) {
  const router = useRouter()
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
    <div className={cn('flex-1 flex justify-center py-3 ', isScrollable && 'overflow-y-auto')}>
      <div className="flex flex-col gap-3 w-full ">
        {memos.map((memo) => (
          <Card
            key={memo.id}
            className="flex flex-col gap-5 cursor-pointer p-3 hover:bg-accent/50 transition-colors"
            onClick={() => {
              router.push(`/memo/${memo.id}`)
            }}
          >
            <div className="flex gap-2">
              <FileText className="w-4 h-4 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-foreground truncate">{memo.title}</p>
                <div className="text-sm text-muted-foreground line-clamp-1 ">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{memo.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
