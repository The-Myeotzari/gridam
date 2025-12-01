import { getMemoListAction } from '@/features/memo/api/memo.action'
import MemoListPage from '@/features/memo/components/memo-list-page'

export default async function Page() {
  const { ok, data } = await getMemoListAction()
  const memos = ok ? data : []

  return <MemoListPage memos={memos} />
}
