'use client'

import { Diary } from '@/features/feed/feed.type'
import { Card, CardBody, CardFooter, CardHeader } from '@/shared/ui/card'
import DropBox from '@/shared/ui/dropbox'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type FeedCardProps = {
  diary: Diary
  isFirst?: boolean
  onDelete: (id: string) => void
}

export default function FeedCard({ diary, isFirst, onDelete }: FeedCardProps) {
  const router = useRouter()
  const hasEmoji = typeof diary.emoji === 'string' && diary.emoji.trim() !== ''

  const handleEdit = () => router.push(`/${diary.id}`)

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
        cardTitle={diary.date}
        align="horizontal"
        className="text-muted-foreground font-semibold"
      />

      <CardBody className="text-left">{diary.content}</CardBody>

      <CardFooter className="relative w-full aspect-square">
        {diary.image_url && (
          <Image
            src={diary.image_url}
            alt={`${diary.id}_그림일기_이미지`}
            fill
            className="object-contain"
            loading={isFirst ? 'eager' : 'lazy'}
            priority={!!isFirst}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 576px, 672px"
          />
        )}
      </CardFooter>
    </Card>
  )
}
