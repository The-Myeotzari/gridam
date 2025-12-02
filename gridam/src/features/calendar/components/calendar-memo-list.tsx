'use client'
import { Memo } from '@/features/memo/api/memo.action'
import { Card } from '@/shared/ui/card'
import cn from '@/shared/utils/cn'
import { getFormatDate } from '@/shared/utils/get-format-date'
import StripMarkDown from '@/shared/utils/strip-markdown'
import { FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'

const todayDate = getFormatDate()

interface CalendarMemoList {
  memos?: Memo[]
  isLoading: boolean
}
export default function CalendarMemoList({ memos, isLoading }: CalendarMemoList) {
  const router = useRouter()
  let content
  const isScrollable = memos && memos.length > 6
  if (isLoading) {
    content = (
      <div className="h-full flex items-center justify-center text-muted-foreground font-handwritten p-4 text-center text-sm ">
        메모를 불러오고 있어요!
      </div>
    )
  } else if (!memos?.length) {
    content = (
      <div className="h-full flex items-center justify-center text-muted-foreground font-handwritten p-4 text-center text-sm">
        메모가 없습니다
      </div>
    )
  } else {
    // 메모가 있을 때
    content = (
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
                <p className=" text-sm text-muted-foreground line-clamp-1 ">
                  {StripMarkDown(memo.content)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }
  return (
    <div className="mb-4 flex flex-col flex-1 gap ">
      <h3 className="font-handwritten text-xl mb-2 text-navy-gray font-bold">메모</h3>
      <div className="bg-pink-400 text-xs w-34 text-center text-white rounded-full p-1.5 ">
        {todayDate}
      </div>
      {/* 메모 목록 */}
      <div className={cn('flex-1 flex justify-center py-6 ', isScrollable && 'overflow-y-auto')}>
        {content}
      </div>
    </div>
  )
}
