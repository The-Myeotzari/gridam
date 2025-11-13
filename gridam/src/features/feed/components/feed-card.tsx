import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/card'
import DropBox from '@/components/ui/dropbox'
import Image from 'next/image'

type props = {
  id: string
  emoji: string
  date: string
  contents: string
  diaryImage: string
}

export default function FeedCard() {
  return (
    <Card>
      <CardHeader
        cardImage={<Image src="/icon/clear-sky.svg" alt="날씨 이모지" width={36} height={36} />}
        // 게시글 id
        right={<DropBox id="1" />}
        cardTitle="2025.12.12"
        align="horizontal"
        className="text-muted-foreground font-semibold"
      />

      <CardBody className="text-left">내용</CardBody>
      <CardFooter className="relative w-full aspect-square">
        {/* 이미지 있을 떄만 출력 */}
        <Image src="/icon/clear-sky.svg" alt="이미지" fill className="object-contain" />
      </CardFooter>
    </Card>
  )
}
