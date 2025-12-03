'use client'

import { fetchDiaryPage } from '@/app/(main)/action'
import type { FetchDiaryResponseType } from '@/features/feed/feed.type'
import { useCallback, useMemo, useRef, useState } from 'react'

type LoadMoreResult = boolean

type Props = {
  year: string
  month: string
  initialPage: FetchDiaryResponseType
}

export function useFeedPagination({ year, month, initialPage }: Props) {
  const [pages, setPages] = useState<FetchDiaryResponseType[]>([initialPage])
  const [isError, setIsError] = useState(false)
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  const lastPageRef = useRef<FetchDiaryResponseType>(initialPage)

  const allItems = useMemo(() => pages.flatMap((p) => p.items), [pages])

  const loadMore = useCallback((): LoadMoreResult => {
    const lastPage = lastPageRef.current

    if (!lastPage?.hasMore) return false
    if (isFetchingMore) return true

    setIsFetchingMore(true)
    ;(async () => {
      try {
        const { data: nextPage } = await fetchDiaryPage({
          year,
          month,
          cursor: lastPage.nextCursor,
        })

        if (!nextPage) {
          setIsError(true)
          return
        }

        setPages((prev) => {
          const next = [...prev, nextPage]
          lastPageRef.current = nextPage
          return next
        })
      } catch {
        setIsError(true)
      } finally {
        setIsFetchingMore(false)
      }
    })()

    return true
  }, [isFetchingMore, month, year])

  const removeItemById = useCallback((id: string) => {
    setPages((prev) =>
      prev.map((page) => ({
        ...page,
        items: page.items.filter((d) => d.id !== id),
      }))
    )
  }, [])

  const rollbackPages = useCallback((snapshot: FetchDiaryResponseType[]) => {
    setPages(snapshot)
    const last = snapshot[snapshot.length - 1]
    if (last) lastPageRef.current = last
  }, [])

  return {
    pages,
    allItems,
    isError,
    isFetchingMore,
    loadMore,
    removeItemById,
    rollbackPages,
  }
}
