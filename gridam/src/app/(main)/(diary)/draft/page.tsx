import getSupabaseServer from '@/shared/utils/supabase/server'
import DraftList from './draft-list'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const supabase = await getSupabaseServer()

  const { data } = await supabase
    .from('diaries')
    .select('*')
    .eq('status', 'draft')
    .is('published_at', null)
    .is('deleted_at', null)
    .order('updated_at', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-4 p-4 mt-10 text-center">
      <div className="mb-8 text-center animate-fade-in">
        <h1 className="font-bold text-4xl mb-2 text-navy-gray">임시 글 목록</h1>
        <p className="font-bold text-xl text-muted-foreground">
          작성 중이던 일기를 불러올 수 있어요
        </p>
      </div>
      <DraftList initialDrafts={data ?? []} />
    </div>
  )
}
