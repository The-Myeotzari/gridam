import { getDiaryAction } from '@/app/(main)/(diary)/[id]/action'
import DiaryForm from '@/features/diary/components/diary-form'
import DiaryLayout from '@/features/diary/components/diary-layout'
import { MESSAGES } from '@/shared/constants/messages'
import Button from '@/shared/ui/button'
import { getFormatDate } from '@/shared/utils/get-format-date'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { ok, data: diary } = await getDiaryAction(id)

  const dateValue = diary.date
  const formattedDate = getFormatDate(dateValue)
  // 날씨 예외처리 고민 필요 - 기본이미지 출력?
  const weatherIcon = diary.emoji ?? '/fallback-weather.png'

  return (
    <DiaryLayout date={formattedDate} weatherIcon={weatherIcon}>
      {ok ? (
        <DiaryForm dateValue={dateValue} isEdit={true} diary={diary} />
      ) : (
        <div className="h-50 flex flex-col justify-center items-center">
          <p className="mb-4">{MESSAGES.DIARY.ERROR.READ}</p>
          <Link href="/">
            <Button
              label={
                <div className="flex items-center">
                  <ArrowLeft className="mr-2" />
                  <span>뒤로가기</span>
                </div>
              }
            />
          </Link>
        </div>
      )}
    </DiaryLayout>
  )
}
