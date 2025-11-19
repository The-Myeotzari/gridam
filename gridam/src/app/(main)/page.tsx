import { fetchDiaryPage } from '@/app/(main)/action'
import FeedList from '@/features/feed/components/feed-list'
import { resolveYearMonth } from '@/features/feed/utils/diary-date'

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams
  const { year, month } = resolveYearMonth(params)

  const firstPage = await fetchDiaryPage({ year, month, cursor: null })

  return (
    <div className="flex flex-col gap-4 p-4 mt-10 text-center">
      <h1 className="font-bold text-4xl mb-2 text-navy-gray">오늘의 이야기들</h1>
      <p className="font-bold text-xl text-muted-foreground">모두의 하루를 담은 그림 일기</p>

      <FeedList year={year} month={month} initialPage={firstPage} />
    </div>
  )
}
