import { getFormatDate } from '@/shared/utils/get-format-date'

const todayDate = getFormatDate()

interface CalendarMemoList {
  memos?: any[]
  isLoading: boolean
}
export default function CalendarMemoList({ memos, isLoading }: CalendarMemoList) {
  return (
    <div className="mb-4 flex flex-col flex-1 gap">
      <h3 className="font-handwritten text-xl mb-2 text-navy-gray">메모</h3>
      <div className="bg-pink-400 text-xs w-34 text-center text-white rounded-full p-1.5">
        {todayDate}
      </div>
      {/* 메모 목록 */}
      <div className=" flex-1 flex items-center justify-center p-6">
        <div>일정이 없습니다.</div>
      </div>
    </div>
  )
}
