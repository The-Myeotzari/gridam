'use client'

import { Diary } from "@/features/mypage/types/mypage"
import Textarea from "@/shared/ui/textarea.client"
import { getFormatDate } from "@/shared/utils/date"
import Image from "next/image"
import { useMemo } from "react"

interface DiaryPreviewCardProps {
  diary: Diary
}

function calcTextareaMax(len: number) {
  if (len <= 50) return 50
  return Math.min(200, Math.ceil(len / 10) * 10)
}

export default function DiaryPreviewCard({ diary }: DiaryPreviewCardProps) {
  const textareaMax = useMemo(() => calcTextareaMax(diary.content?.length ?? 0), [diary.content])
  const formattedDate = getFormatDate(diary.date)

  return (
    <article
      key={diary.id}
      className="rounded-md bg-white p-3 border border-border space-y-2"
    >
      <header className="flex justify-between items-center text-xs sm:text-sm">
        <span className="text-base sm:text-lg">{formattedDate}</span>
        {diary.emoji && <Image src={diary.emoji} alt="날씨" width={40} height={40} />}
      </header>
      <section className="bg-white border">
        {diary.image_url && (
          <Image
            src={diary.image_url}
            alt="그림"
            width={40}
            height={40}
            className="w-full"
          />
        )}
      </section>
      <section>
        <Textarea value={diary.content} max={textareaMax} readOnly />
      </section>
    </article>
  )
}