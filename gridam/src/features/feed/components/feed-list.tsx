'use client'

import { deleteDiary, fetchDiaryPage } from '@/app/(main)/action'
import FeedCard from '@/features/feed/components/feed-card'
import FeedCardSkeleton from '@/features/feed/components/feed-card-skeleton'
import FeedListError from '@/features/feed/components/feed-list-error'
import { Diary, DiaryPage } from '@/features/feed/feed.type'
import { useIntersection } from '@/features/feed/hooks/use-intersection'
import { MESSAGES } from '@/shared/constants/messages'
import Button from '@/shared/ui/button'
import { ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/modal/modal'
import { modalStore } from '@/store/modal-store'
import { refresh } from 'next/cache'
import { useCallback, useOptimistic, useState, useTransition } from 'react'

type FeedListProps = {
  year: string
  month: string
  initialPage: DiaryPage
}

export default function FeedList({ year, month, initialPage }: FeedListProps) {
  const [pages, setPages] = useState<DiaryPage[]>([initialPage])
  const [isError, setIsError] = useState(false)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [isPending, startTransition] = useTransition()

  const allItems = pages.flatMap((p) => p.items)

  const [optimisticItems, updateOptimisticItems] = useOptimistic<Diary[], string>(
    allItems,
    (state, removedId) => state.filter((d) => d.id !== removedId)
  )

  // 무한스크롤
  const loadMore = useCallback(async () => {
    const lastPage = pages[pages.length - 1]
    if (!lastPage?.hasMore || isFetchingMore) return

    setIsFetchingMore(true)

    const nextPage = await fetchDiaryPage({
      year,
      month,
      cursor: lastPage.nextCursor,
    })

    if (!nextPage) {
      setIsError(true)
      setIsFetchingMore(false)
      return
    }

    setPages((prev) => [...prev, nextPage])
    setIsFetchingMore(false)
  }, [pages, year, month, isFetchingMore])

  const ref = useIntersection(loadMore)

  const handleDelete = useCallback(
    (id: string) => {
      startTransition(async () => {
        updateOptimisticItems(id)
        const res = await deleteDiary(id)
        if (!res.ok) {
          setPages((prev) =>
            prev.map((page) => ({
              ...page,
              items: page.items.filter((d) => d.id !== id),
            }))
          )
        }
      })
    },
    [updateOptimisticItems]
  )

  const openDeleteModal = (id: string) => {
    modalStore.open((close) => (
      <>
        <ModalHeader>정말 삭제할까요?</ModalHeader>
        <ModalBody className="p-6 text-slate-600">
          삭제 후에는 되돌릴 수 없습니다.
          <br />
          해당 그림일기를 삭제하시겠습니까?
        </ModalBody>
        <ModalFooter className="p-4 flex justify-end gap-2">
          <span onClick={close}>
            <Button label={MESSAGES.COMMON.CANCEL_BUTTON} />
          </span>
          <span
            onClick={() => {
              startTransition(async () => {
                await handleDelete(id)
                close()
              })
            }}
          >
            <Button
              type="submit"
              label={MESSAGES.COMMON.DELETE_BUTTON}
              className="bg-(--color-background) text-destructive border-destructive hover:bg-destructive hover:text-(--color-destructive-foreground)"
            />
          </span>
        </ModalFooter>
      </>
    ))
  }

  if (isError && pages.length === 0) {
    return <FeedListError onRetry={() => refresh()} />
  }

  if (!initialPage) {
    return <FeedCardSkeleton />
  }

  if (optimisticItems.length === 0) {
    return <div className="text-muted-foreground">작성된 일기가 없어요!</div>
  }

  return (
    <div className="flex flex-col gap-4 sm:w-2xl sm:mx-auto">
      {/* TODO: 추후 스피너 컴포넌트로 교체 필요 */}
      {isPending && <div>로딩중입니다</div>}
      {optimisticItems.map((diary, idx) => (
        <FeedCard key={diary.id} diary={diary} isFirst={idx === 0} onDelete={openDeleteModal} />
      ))}

      <div ref={ref} className="h-10" />
    </div>
  )
}
