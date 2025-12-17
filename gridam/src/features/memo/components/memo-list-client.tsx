'use client'

import type { Memo } from '@/features/memo/api/memo.action'
import MemoSearch from '@/features/memo/components/memo-search'
import { URL_CONSTANTS } from '@/shared/constants/url.constants'
import { Card } from '@/shared/ui/card'
import TagBadge from '@/shared/ui/tagbadge'
import { formatDotDateKR } from '@/shared/utils/date'
import Link from 'next/link'
import { useMemo, useState } from 'react'

type Props = {
  memos: Memo[]
}

type Tag = string

export default function MemoListClient({ memos }: Props) {
  const [keyword, setKeyword] = useState('')
  const [selectedTag, setSelectedTag] = useState<Tag | '전체'>('전체')

  const hasMemos = memos.length > 0

  // 전체 태그 목록
  const tagList = useMemo(() => {
    const set = new Set<Tag>()
    memos.forEach((memo) => {
      memo.tags?.forEach((tag) => set.add(tag))
    })
    return ['전체', ...Array.from(set)]
  }, [memos])

  // 제목 + 태그 필터링
  const filteredMemos = useMemo(() => {
    if (!hasMemos) return []

    const q = keyword.trim().toLowerCase()

    return memos.filter((memo) => {
      const title = memo.title ?? ''
      const titleMatch = q ? title.toLowerCase().includes(q) : true

      const tags = memo.tags ?? []
      const tagMatch = selectedTag === '전체' ? true : tags.includes(selectedTag)

      return titleMatch && tagMatch
    })
  }, [keyword, memos, selectedTag, hasMemos])

  const hasResults = filteredMemos.length > 0

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 md:flex-row">
      <aside className="flex w-full flex-col rounded-3xl border border-border bg-transparent p-6 md:w-56 md:max-h-[520px]">
        <h2 className="text-lg font-semibold text-foreground">태그</h2>
        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar md:hidden">
          {tagList.map((tag) => {
            const isSelected = selectedTag === tag
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag === '전체' ? '전체' : tag)}
                className={[
                  'shrink-0 rounded-2xl px-4 py-1 text-xs transition',
                  isSelected
                    ? 'bg-primary/20 text-primary font-semibold'
                    : 'bg-muted text-muted-foreground hover:bg-muted/70',
                ].join(' ')}
              >
                {tag}
              </button>
            )
          })}
        </div>

        <div className="mt-5 hidden flex-col gap-3 overflow-auto no-scrollbar md:flex">
          {tagList.map((tag) => {
            const isSelected = selectedTag === tag
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag === '전체' ? '전체' : tag)}
                className={[
                  'w-full rounded-2xl px-4 py-2 text-left text-sm transition',
                  isSelected
                    ? 'bg-primary/20 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-muted/50',
                ].join(' ')}
              >
                {tag}
              </button>
            )
          })}
        </div>
      </aside>

      <section className="flex min-h-[520px] max-h-[calc(100vh-300px)] flex-1 min-w-0 flex-col rounded-3xl border border-border p-5 shadow-sm">
        {hasMemos && (
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-lg font-semibold text-foreground">리스트</p>

            <div className="w-full md:w-64">
              <MemoSearch value={keyword} onChange={setKeyword} />
            </div>
          </div>
        )}

        {hasMemos ? (
          hasResults ? (
            <div className="flex flex-1 min-w-0 flex-col gap-3 overflow-y-auto no-scrollbar">
              {filteredMemos.map((memo) => {
                const tags = memo.tags ?? []

                return (
                  <Link
                    key={memo.id}
                    href={`${URL_CONSTANTS.MEMO.BY_ID(memo.id)}`}
                    className="block"
                  >
                    <Card className="w-full cursor-pointer rounded-3xl px-6 py-4 hover:bg-accent/70">
                      <div className="flex items-center justify-between gap-4">
                        <span className="truncate text-base font-medium text-foreground">
                          {memo.title || '(제목 없음)'}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatDotDateKR(memo.created_at)}
                        </span>
                      </div>

                      {tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <TagBadge
                              key={tag}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setSelectedTag(tag)
                              }}
                            >
                              {tag}
                            </TagBadge>
                          ))}
                        </div>
                      )}
                    </Card>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm font-medium text-foreground">검색 결과가 없어요.</p>
              <p className="text-xs text-muted-foreground">
                다른 키워드로 다시 검색해보거나, 검색어를 지워보세요.
              </p>
            </div>
          )
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <p className="text-sm text-muted-foreground">
              아직 메모가 없어요.
              <br />
              오른쪽 상단의 <span className="font-semibold">+ 새 메모</span> 버튼을 눌러 첫 메모를
              작성해보세요.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
