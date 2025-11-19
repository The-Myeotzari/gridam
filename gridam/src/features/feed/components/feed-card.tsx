import { default as useDeleteDiaryModal } from '@/features/feed/hooks/use-delete-diary-modal'
import type { Diary } from '@/features/feed/types/feed'
import { Card, CardBody, CardFooter, CardHeader } from '@/shared/ui/card'
import DropBox from '@/shared/ui/dropbox'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type props = {
  diary: Diary
  isFirst?: boolean
}

export default function FeedCard({ diary, isFirst }: props) {
  const router = useRouter()
  const hasEmoji = typeof diary.emoji === 'string' && diary.emoji.trim() !== ''

  const handleEdit = () => router.push(`/${diary.id}`)
  const openDeleteModal = useDeleteDiaryModal(diary.id)

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
        right={
          <DropBox id={diary.id} onEdit={() => handleEdit()} onDelete={() => openDeleteModal()} />
        }
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
