import { getDiaryAction } from '@/app/(main)/(diary)/[id]/action'
import DiaryForm from '@/features/diary/components/diary-form'
import DiaryLayout from '@/features/diary/components/diary-layout'
import { MESSAGES } from '@/shared/constants/messages'
import Button from '@/shared/ui/button'
import CanvasContainer from '@/shared/ui/canvas/canvas-container'
import { getFormatDate } from '@/shared/utils/date'
import { SITE_URL } from '@/shared/utils/url'
import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

type PageProps = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const url = new URL(`/${id}`, SITE_URL)
  const { ok, data: diary } = await getDiaryAction(id)
  if (!ok || !diary) {
    return {
      metadataBase: new URL(SITE_URL),
      title: '일기를 찾을 수 없어요 | Gridam',
      description: '요청한 일기를 불러오지 못했습니다.',
      alternates: { canonical: url },
      robots: { index: false, follow: false },
    }
  }

  const formattedDate = getFormatDate(diary.date)
  const title = `${formattedDate} 일기 수정 및 발행 | Gridam`
  const description = `${formattedDate}에 작성한 그림 일기를 수정 및 발행합니다.`

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Gridam',
      type: 'article',
      locale: 'ko_KR',
      images: diary.image_url
        ? [
            {
              url: diary.image_url.startsWith('http')
                ? diary.image_url
                : new URL(diary.image_url, SITE_URL),
            },
          ]
        : undefined,
    },
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const { ok, data: diary } = await getDiaryAction(id)

  const dateValue = diary.date
  const formattedDate = getFormatDate(dateValue)
  // TODO 날씨 예외처리 고민 필요 - 기본이미지 출력?
  const weatherIcon = diary.emoji ?? '/fallback-weather.png'

  if (!ok) {
    return (
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
    )
  }

  return (
    <DiaryLayout
      date={formattedDate}
      weatherIcon={weatherIcon}
      canvasSection={<CanvasContainer initialImage={diary.image_url} />}
      formSection={<DiaryForm diary={diary} dateValue={dateValue} isEdit={true} />}
    />
  )
}
