import { getMemoDetailAction } from '@/features/memo/api/memo.action'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getFormatDate } from '@/shared/utils/get-format-date'
import { Card, CardBody } from '@/shared/ui/card'
import MemoEditTrigger from './memo-edit-trigger'
import MemoDeleteTrigger from './memo-delete-trigger'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  const { ok, data: memo } = await getMemoDetailAction(id)

  if (!ok || !memo?.id) {
    notFound()
  }

  const formattedDate = getFormatDate(memo.created_at)

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <header className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/memo" className="flex items-center gap-1 hover:underline">
            <ArrowLeft className="h-4 w-4" />
            목록으로
          </Link>
        </header>

        <section className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{memo.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{formattedDate}</p>
          </div>

          <div className="flex gap-2">
            <MemoEditTrigger memo={memo} />
            <MemoDeleteTrigger id={memo.id} />
          </div>
        </section>

        <Card className="mt-4">
          <CardBody>
            <div className="prose max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{memo.content}</ReactMarkdown>
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
  )
}
