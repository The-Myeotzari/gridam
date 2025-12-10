import { getMemoListAction } from '@/features/memo/api/memo.action'
import MemoCreateButton from '@/features/memo/components/memo-create-button'
import MemoListClient from '@/features/memo/components/memo-list-client'

export default async function Page() {
  const { ok, data } = await getMemoListAction()
  const memos = ok ? data : []

  return (
    <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-screen-xl flex-col gap-6 px-4 py-10">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-foreground">메모장</h1>
          <p className="text-sm text-muted-foreground">자유롭게 메모를 작성해보세요.</p>
        </div>

        <MemoCreateButton />
      </header>

      <MemoListClient memos={memos} />
    </div>
  )
}
