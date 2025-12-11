'use client'
import Textarea from '@/shared/ui/textarea.client'
import Image from 'next/image'

interface DiaryReadOnlyProps {
  diary: {
    id: string
    date: string // "2025-11-26"
    content: string
    emoji?: string | null
    image_url?: string | null
  }
}

export function DiaryReadOnly({ diary }: DiaryReadOnlyProps) {
  const formattedDate = diary.date
  const weatherIcon = diary.emoji ?? '/fallback-weather.png'

  return (
    <div className="flex flex-col gap-3 w-full border p-4 rounded-2xl">
      {/* 날짜, 날씨 */}
      <div className="flex items-center justify-between w-full ">
        <span className="text-lg font-bold">{formattedDate}</span>
        {weatherIcon && <Image src={weatherIcon} alt="날씨" width={40} height={40} />}
      </div>
      <hr />
      {/* 이미지 */}
      <div className="border rounded-2xl">
        {diary.image_url && (
          <Image
            src={diary.image_url}
            alt="사용자가 그린 그림"
            width={800}
            height={800}
            className="w-full h-full object-cover"
            unoptimized
          />
        )}
      </div>
      <hr />
      {/* 글 */}
      <Textarea value={diary.content} readOnly={true} />
    </div>
  )
}
