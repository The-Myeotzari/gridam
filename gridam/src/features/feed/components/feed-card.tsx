'use client'

import { Diary } from '@/features/feed/feed.type'
import { Card, CardBody, CardFooter, CardHeader } from '@/shared/ui/card'
import DropBox from '@/shared/ui/dropbox'
import Textarea from '@/shared/ui/textarea'
import { getFormatDate } from '@/shared/utils/date'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

type FeedCardProps = {
  diary: Diary
  isFirst?: boolean
  onDelete: (id: string) => void
}

function calcTextareaMax(len: number) {
  if (len <= 50) return 50
  return Math.min(200, Math.ceil(len / 10) * 10)
}

export default function FeedCard({ diary, isFirst, onDelete }: FeedCardProps) {
  const router = useRouter()
  const hasEmoji = typeof diary.emoji === 'string' && diary.emoji.trim() !== ''

  const handleEdit = () => router.push(`/${diary.id}`)

  const textareaMax = useMemo(() => calcTextareaMax(diary.content?.length ?? 0), [diary.content])

  return (
    <Card>
      <CardHeader
        cardImage={
          hasEmoji ? (
            <Image
              src={diary.emoji!}
              alt={`${diary.id}_날씨_아이콘_이미지`}
              width={36}
              height={36}
            />
          ) : (
            <div className="flex items-center justify-center h-9 w-9 text-xs text-muted-foreground">
              날씨 <br /> 없음
            </div>
          )
        }
        right={<DropBox id={diary.id} onEdit={handleEdit} onDelete={() => onDelete(diary.id)} />}
        cardTitle={getFormatDate(diary.date)}
        align="horizontal"
        className="text-muted-foreground font-semibold"
      />

      <CardBody className="pb-0">
        <div className="relative w-full h-full aspect-video overflow-hidden border border-gray-200 rounded-xl aspect-w-16 aspect-h-9">
          {diary.image_url && (
            <Image
              src={diary.image_url}
              alt={`${diary.id}_그림일기_이미지`}
              fill
              loading={isFirst ? 'eager' : 'lazy'}
              priority={!!isFirst}
            />
          )}
        </div>
      </CardBody>
      <CardFooter className="max-w-full">
        <Textarea value={diary.content} max={textareaMax} className="w-full" />
      </CardFooter>
    </Card>
  )
}
