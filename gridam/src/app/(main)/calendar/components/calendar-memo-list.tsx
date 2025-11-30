'use client'
import { Memo } from '@/features/memo/api/memo.action'
import MemoListPage from '@/features/memo/components/memo-list-page'
import { Card } from '@/shared/ui/card'
import { getFormatDate } from '@/shared/utils/get-format-date'
import { useRouter } from 'next/navigation'

const todayDate = getFormatDate()

interface CalendarMemoList {
  memos?: Memo[]
  isLoading: boolean
}
export default function CalendarMemoList({ memos, isLoading }: CalendarMemoList) {
  const router = useRouter()
  let content
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
    //메모가 있을 경우

    content = (
      // <div className=" ">
      //   {memos.map((memo, index) => (
      //     <div key={index}>{memo.title}</div>
      //   ))}
      // </div>

      <section className="flex flex-col gap-3 w-full">
        {memos.map((memo) => (
          <Card
            key={memo.id}
            className="
                        flex cursor-pointer items-center justify-between
                        rounded-3xl bg-card px-6 py-4
                        shadow-sm transition
                        hover:shadow-md
                      "
            onClick={() => router.push(`/memo/${memo.id}`)}
          >
            <span className="truncate text-base font-medium text-foreground">
              {memo.title || '(제목 없음)'}
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">
              {new Date(memo.created_at).toLocaleDateString().replace(/\./g, '.').trim()}
            </span>
          </Card>
        ))}
      </section>
    )
  }
  return (
    <div className="mb-4 flex flex-col flex-1 gap">
      <h3 className="font-handwritten text-xl mb-2 text-navy-gray font-bold">메모</h3>
      <div className="bg-pink-400 text-xs w-34 text-center text-white rounded-full p-1.5 ">
        {todayDate}
      </div>
      {/* 메모 목록 */}
      <div className=" flex-1 flex  justify-center py-6">{content}</div>
    </div>
  )
}
