import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/card'
import DropBox from '@/components/ui/dropbox'
import { Diary } from '@/features/feed/types/feed'
import Image from 'next/image'

type props = {
  diary: Diary
  isFirst?: boolean
}

export default function FeedCard({ diary, isFirst }: props) {
  const hasEmoji = typeof diary.emoji === 'string' && diary.emoji.trim() !== ''

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
              날씨
              <br />
              없음
            </div>
          )
        }
        right={<DropBox id={diary.id} />}
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
          />
        )}
      </CardFooter>
    </Card>
  )
}
