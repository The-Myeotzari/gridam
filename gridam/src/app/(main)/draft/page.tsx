import { fetchDraftAction } from '@/app/(main)/draft/actions'
import DraftList from '@/app/(main)/draft/draft-list'
import { MESSAGES } from '@/shared/constants/messages'
import Button from '@/shared/ui/button'
import { SITE_URL } from '@/shared/utils/url'
import { Link, RefreshCcw } from 'lucide-react'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: '일기 보관함 | Gridam',
  description: '작성 중이던 일기를 불러오고 수정/삭제할 수 있어요.',
  alternates: { canonical: new URL('/draft', SITE_URL) },
  robots: { index: false, follow: false },
  openGraph: {
    title: '일기 보관함 | Gridam',
    description: '작성 중이던 일기를 불러오고 수정/삭제할 수 있어요.',
    url: new URL('/draft', SITE_URL),
    siteName: 'Gridam',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default async function Page() {
  const { ok, data: diary } = await fetchDraftAction()

  return (
    <div className="flex flex-col gap-4 p-4 mt-10 text-center">
      <div className="mb-8 text-center animate-fade-in">
        <h1 className="font-bold text-4xl mb-2 text-navy-gray">일기 보관함</h1>
        <p className="font-bold text-xl text-muted-foreground">
          작성 중이던 일기를 불러올 수 있어요
        </p>
      </div>
      {ok ? (
        <DraftList initialDrafts={diary ?? []} />
      ) : (
        <div className="h-50 flex flex-col justify-center items-center">
          <p className="mb-4">{MESSAGES.DIARY.ERROR.DRAFT_READ}</p>
          <Link href="/draft">
            <Button
              label={
                <div className="flex items-center">
                  <RefreshCcw className="mr-2" />
                  <span>새로고침</span>
                </div>
              }
            />
          </Link>
        </div>
      )}
    </div>
  )
}
