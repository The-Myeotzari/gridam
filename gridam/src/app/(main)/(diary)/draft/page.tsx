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

  return <DraftList initialDrafts={data ?? []} />
}
