'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Memo } from '@/features/memo/api/memo.action'
import Button from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import MemoEditorDialog from './memo-editor-dialog'

type Props = {
  memos: Memo[]
}

export default function MemoListPage({ memos }: Props) {
  const router = useRouter()

  const [editorOpen, setEditorOpen] = useState(false)

  const hasMemos = memos.length > 0

  function handleCreate() {
    setEditorOpen(true)
  }

  function handleOpenChange(next: boolean) {
    setEditorOpen(next)
  }

  function handleSuccess() {
    router.refresh()
  }

  return (
    <>
      <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-2xl flex-col gap-6 px-4 py-10">
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-foreground">메모장</h1>
            <p className="text-sm text-muted-foreground">자유롭게 메모를 작성해보세요.</p>
          </div>

          <div onClick={handleCreate} className="cursor-pointer">
            <Button type="button" variant="blue" size="lg" label="+ 새 메모" />
          </div>
        </header>

        {hasMemos ? (
          <section className="flex flex-col gap-3">
            {memos.map((memo) => (
              <Card
                key={memo.id}
                className="
                  flex cursor-pointer items-center justify-between
                  rounded-3xl bg-card px-6 py-4
                  shadow-sm transition
                  hover:shadow-md
                "
                onClick={() => router.push(`/memo/${memo.id}`)}
              >
                <span className="truncate text-base font-medium text-foreground">
                  {memo.title || '(제목 없음)'}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(memo.created_at).toLocaleDateString().replace(/\./g, '.').trim()}
                </span>
              </Card>
            ))}
          </section>
        ) : (
          <section className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <p className="text-sm text-muted-foreground">
              아직 메모가 없어요.
              <br />
              오른쪽 상단의 <span className="font-semibold">+ 새 메모</span> 버튼을 눌러 첫 메모를
              작성해보세요.
            </p>
          </section>
        )}
      </div>

      <MemoEditorDialog
        open={editorOpen}
        onOpenChange={handleOpenChange}
        initialMemo={null}
        onSuccess={handleSuccess}
      />
    </>
  )
}
