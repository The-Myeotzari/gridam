import Button from '@/components/ui/button'
import { QUERY_KEYS } from '@/constants/query-key'
import { getDiaryServer } from '@/features/feed/api/get-diary.server'
import FeedList from '@/features/feed/components/feed-list'
import Month from '@/features/feed/components/month'
import { type DiarySearchParams, resolveYearMonth } from '@/features/feed/utils/diary-date'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import Link from 'next/link'

type Props = {
  searchParams: Promise<DiarySearchParams>
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams
  const { year, month } = resolveYearMonth(params)

  const { items, nextCursor, hasMore } = await getDiaryServer({ year, month })

  const queryClient = new QueryClient()
  queryClient.setQueryData(QUERY_KEYS.DIARY.LIST(year, month), {
    pages: [{ items, nextCursor, hasMore }],
    pageParams: [null],
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <div className="flex flex-col gap-4 p-4 mt-10 text-center">
      <div className="mb-8 text-center animate-fade-in">
        <h1 className="font-handwritten text-4xl mb-2 text-navy-gray">오늘의 이야기들</h1>
        <p className="font-handwritten text-xl text-muted-foreground">
          모두의 하루를 담은 그림 일기
        </p>
      </div>

      <Month year={year} month={month} />

      <HydrationBoundary state={dehydratedState}>
        <FeedList year={year} month={month} initialDiaries={items} />
      </HydrationBoundary>

      <Link href="/write">
        <Button
          size="lg"
          className="fixed bottom-8 right-8 rounded-full w-16 h-16 shadow-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground hover:scale-110 transition-all"
          label={<Plus className="w-8 h-8" />}
        />
      </Link>
    </div>
  )
}
