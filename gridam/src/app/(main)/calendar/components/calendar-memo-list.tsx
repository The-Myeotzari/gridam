import { getFormatDate } from '@/shared/utils/get-format-date'

const todayDate = getFormatDate()

interface CalendarMemoList {
  memos?: any[]
  isLoading: boolean
}
export default function CalendarMemoList({ memos, isLoading }: CalendarMemoList) {
  let content
  if (isLoading) {
    content = <div>메모를 불러오고 있어요!</div>
  } else if (!memos?.length) {
    content = <div>메모가 없습니다.</div>
  } else {
    //메모가 있을 경우
    content = (
      <div className=" ">
        {memos.map((memo, index) => (
          <div key={index}>{memo.title}</div>
        ))}
      </div>
    )
  }
  return (
    <div className="mb-4 flex flex-col flex-1 gap">
      <h3 className="font-handwritten text-xl mb-2 text-navy-gray">메모</h3>
      <div className="bg-pink-400 text-xs w-34 text-center text-white rounded-full p-1.5">
        {todayDate}
      </div>
      {/* 메모 목록 */}
      <div className=" flex-1 flex items-center justify-center p-6">{content}</div>
    </div>
  )
}
