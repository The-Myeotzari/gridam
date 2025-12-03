'use client'

import FeedCard from '@/features/feed/components/feed-card'
import FeedCardSkeleton from '@/features/feed/components/feed-card-skeleton'
import FeedListError from '@/features/feed/components/feed-list-error'
import type { Diary, FetchDiaryResponseType } from '@/features/feed/feed.type'
import { useDiaryDeleteModal } from '@/features/feed/hooks/use-diary-delete-modal'
import { useFeedPagination } from '@/features/feed/hooks/use-feed-pagination'
import { useIntersection } from '@/features/feed/hooks/use-intersection'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

export type FeedListProps = {
  year: string
  month: string
  initialPage: FetchDiaryResponseType
}

function dedupeById(items: Diary[]) {
  return Array.from(new Map(items.map((d) => [d.id, d])).values())
}

export default function FeedList({ year, month, initialPage }: FeedListProps) {
  const router = useRouter()

  const { pages, allItems, isError, isFetchingMore, loadMore, removeItemById, rollbackPages } =
    useFeedPagination({ year, month, initialPage })

  const displayedItems = useMemo(() => dedupeById(allItems), [allItems])

  const { openDeleteModal, isDeleting } = useDiaryDeleteModal({
    getPagesSnapshot: () => pages,
    removeItemById,
    rollbackPages,
  })

  const ref = useIntersection(loadMore)

  if (!initialPage) return <FeedCardSkeleton />

  if (isError && pages.length === 0) {
    return <FeedListError onRetry={() => router.refresh()} />
  }

  if (displayedItems.length === 0) {
    return <div className="text-muted-foreground">작성된 일기가 없어요!</div>
  }

  return (
    <div className="flex flex-col gap-4 sm:w-xl md:w-2xl sm:mx-auto">
      {isDeleting && <div>로딩중입니다</div>}

      {displayedItems.map((diary, idx) => (
        <FeedCard key={diary.id} diary={diary} isFirst={idx === 0} onDelete={openDeleteModal} />
      ))}

      {isFetchingMore && <FeedCardSkeleton />}

      <div ref={ref} className="h-10" />
    </div>
  )
}
