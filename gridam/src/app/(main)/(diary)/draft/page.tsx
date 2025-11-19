import { Card, CardBody, CardHeader } from '@/shared/ui/card'
import Link from 'next/link'

export default async function Page() {
  return (
    <div className="flex flex-col gap-4 p-4 mt-10 text-center">
      <div className="mb-8 text-center animate-fade-in">
        <h1 className="font-bold text-4xl mb-2 text-navy-gray">임시 글 목록</h1>
        <p className="font-bold text-xl text-muted-foreground">
          작성 중이던 일기를 불러올 수 있어요
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:w-xl md:w-2xl mx-auto">
        {/* 수정할 아이디로 변경 */}
        <Link href={`/write`}>
          <Card>
            <CardHeader
              cardTitle="글 생성 일자 - 2025-11-17"
              right={<div className="text-sm">저장: 임시 저장 업데이트 일시</div>}
              align="horizontal"
              className="text-muted-foreground"
            />
            <CardBody className="text-left">내용 두 줄 출력</CardBody>
          </Card>
        </Link>
      </div>
    </div>
  )
}
