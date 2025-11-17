'use client'

import { MESSAGES } from '@/constants/messages'
import { QUERY_KEYS } from '@/constants/query-key'
import { getDiary } from '@/features/feed/api/get-diary.api'
import FeedCard from '@/features/feed/components/feed-card'
import FeedCardSkeleton from '@/features/feed/components/feed-card-skeleton'
import FeedListError from '@/features/feed/components/feed-list-error'
import type { Diary } from '@/features/feed/types/feed'
import { useQuery } from '@tanstack/react-query'

type Props = {
  year: string
  month: string
  initialDiaries?: Diary[]
}

export default function FeedList({ year, month, initialDiaries }: Props) {
  const queryOptions = {
    queryKey: QUERY_KEYS.DIARY.LIST(year, month),
    queryFn: () => getDiary({ year, month }),
    initialData: initialDiaries,
  }

  const {
    data: diaries = [],
    isPending,
    isError,
    refetch,
    isRefetching,
  } = useQuery<Diary[]>(queryOptions)

  if (isPending && diaries.length === 0) {
    return <FeedCardSkeleton />
  }

  if (isError) {
    return <FeedListError onRetry={refetch} isLoading={isRefetching} />
  }

  if (diaries.length === 0) {
    return <div className="text-muted-foreground">{MESSAGES.DIARY.SUCCESS.READ_NO_DATA}</div>
  }

  return (
    <div className="flex flex-col gap-4">
      {diaries.map((diary, index) => (
        <FeedCard key={diary.id} diary={diary} isFirst={index === 0} />
      ))}
    </div>
  )
}
