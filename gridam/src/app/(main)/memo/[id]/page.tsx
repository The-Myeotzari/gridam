import MemoDeleteTrigger from '@/app/(main)/memo/[id]/memo-delete-trigger'
import MemoEditTrigger from '@/app/(main)/memo/[id]/memo-edit-trigger'
import { getMemoDetailAction } from '@/features/memo/api/memo.action'
import { markdownComponents } from '@/features/memo/components/markdown-components'
import { URL_CONSTANTS } from '@/shared/constants/url.constants'
import { Card, CardBody } from '@/shared/ui/card'
import TagBadge from '@/shared/ui/tagbadge'
import { getFormatDate } from '@/shared/utils/date'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

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
          <Link href={URL_CONSTANTS.MEMO.BASE} className="flex items-center gap-1 hover:underline">
            <ArrowLeft className="h-4 w-4" />
            목록으로
          </Link>
        </header>

        <section className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{memo.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{formattedDate}</p>

            {memo.tags && memo.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {memo.tags.map((tag) => (
                  <TagBadge key={tag}>{tag}</TagBadge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <MemoEditTrigger memo={memo} />
            <MemoDeleteTrigger id={memo.id} />
          </div>
        </section>

        <Card className="mt-4">
          <CardBody>
            <div className="prose max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={markdownComponents}
              >
                {memo.content}
              </ReactMarkdown>
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
  )
}
