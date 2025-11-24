'use client'
import { Card } from '@/shared/ui/card'
import CalendarComponent from './calendar-component'
import SelectedDateDiary from './selected-date-diary'

export default function Page() {
  return (
    <div>
      {/* 상단 타이틀 그대로 사용 */}
      <div className="mb-8 text-center animate-fade-in">
        <h1 className="font-handwritten text-4xl mb-2 text-navy-gray">캘린더</h1>
        <p className="font-handwritten text-xl text-muted-foreground">날짜별 그림 일기</p>
      </div>
      <Card className="flex flex-col md:flex-row p-6 gap-7 max-w-4xl mx-auto">
        <CalendarComponent />
        <SelectedDateDiary />
      </Card>
    </div>
  )
}
