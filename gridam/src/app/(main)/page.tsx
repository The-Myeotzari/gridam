import { fetchDiaryPage } from '@/app/(main)/action'
import FeedList from '@/features/feed/components/feed-list'
import FeedWriteBtn from '@/features/feed/components/feed-write-btn'
import { resolveYearMonth } from '@/features/feed/utils/diary-date'
import { MESSAGES } from '@/shared/constants/messages'
import Button from '@/shared/ui/button'
import { RefreshCcw } from 'lucide-react'
import Link from 'next/link'

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams
  const { year, month } = resolveYearMonth(params)

  const { ok, data: firstPage } = await fetchDiaryPage({ year, month, cursor: null })

  return (
    <div className="flex flex-col gap-4 p-4 mt-10 text-center">
      <h1 className="font-bold text-4xl mb-2 text-navy-gray">오늘의 이야기들</h1>
      <p className="font-bold text-xl text-muted-foreground">모두의 하루를 담은 그림 일기</p>

      {ok ? (
        <FeedList year={year} month={month} initialPage={firstPage} />
      ) : (
        <div className="h-50 flex flex-col justify-center items-center">
          <p className="mb-4">{MESSAGES.DIARY.ERROR.READ}</p>
          <Link href="/">
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

      <FeedWriteBtn todayDiaryStatus={firstPage?.todayDiaryStatus ? 'none' :firstPage?.todayDiaryStatus } />
    </div>
  )
}
