import { MESSAGES } from '@/shared/constants/messages'
import Button from '@/shared/ui/button'
import { Link, RefreshCcw } from 'lucide-react'
import { fetchDraftAction } from './actions'
import DraftList from './draft-list'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const { ok, data: diary } = await fetchDraftAction()

  return (
    <div className="flex flex-col gap-4 p-4 mt-10 text-center">
      <div className="mb-8 text-center animate-fade-in">
        <h1 className="font-bold text-4xl mb-2 text-navy-gray">임시 글 목록</h1>
        <p className="font-bold text-xl text-muted-foreground">
          작성 중이던 일기를 불러올 수 있어요
        </p>
      </div>
      {ok ? (
        <DraftList initialDrafts={diary ?? []} />
      ) : (
        <div className="h-50 flex flex-col justify-center items-center">
          <p className="mb-4">{MESSAGES.DIARY.ERROR.DRAFT_READ}</p>
          <Link href="/draft">
            <Button
              label={
                <div className="flex items-center">
                  <RefreshCcw className="mr-2" />
                  <span>새로고침</span>
                </div>
              }
            />
          </Link>
        </div>
      )}
    </div>
  )
}
