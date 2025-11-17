'use client'

import { MESSAGES } from '@/constants/messages'
import { useGetDiary } from '@/features/feed//api/use-get-diary'
import { useIntersection } from '@/features/feed//hooks/use-intersection'
import FeedCard from '@/features/feed/components/feed-card'
import FeedCardSkeleton from '@/features/feed/components/feed-card-skeleton'
import FeedListError from '@/features/feed/components/feed-list-error'
import type { Diary } from '@/features/feed/types/feed'

type Props = {
  year: string
  month: string
  initialDiaries: Diary[]
}

type DiaryPage = {
  items: Diary[]
  nextCursor: string | null
  hasMore: boolean
}

export default function FeedList({ year, month, initialDiaries }: Props) {
  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useGetDiary({ year, month, initialDiaries })

  const pages = (data?.pages ?? []) as DiaryPage[]
  const diaries: Diary[] = pages.flatMap((page) => page.items)

  const intersectionRef = useIntersection(() => {
    if (!hasNextPage || isFetchingNextPage) return
    fetchNextPage()
  })

  if (isPending && diaries?.length === 0) {
    return <FeedCardSkeleton />
  }

  if (isError) {
    return <FeedListError onRetry={() => refetch()} isLoading={isRefetching} />
  }

  // 데이터 없을 때
  if (diaries.length === 0) {
    return <div className="text-muted-foreground">{MESSAGES.DIARY.SUCCESS.READ_NO_DATA}</div>
  }

  return (
    <div className="flex flex-col gap-4">
      {diaries.map((diary, index) => (
        <FeedCard key={diary.id} diary={diary} isFirst={index === 0} />
      ))}

      <div ref={intersectionRef} />

      {isFetchingNextPage && <FeedCardSkeleton />}
    </div>
  )
}
