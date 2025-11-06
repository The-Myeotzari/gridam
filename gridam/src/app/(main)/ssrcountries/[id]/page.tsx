import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import Country from '../country'

export default async function CountryPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string }
}) {
  const resolved = 'then' in params ? await params : params
  const id = Number(resolved.id)

  const queryClient = new QueryClient()

  // const supabase = await useSupabaseServer()
  // const { data, error } = await supabase.from('countries').select('*').eq('id', id).single()

  // await prefetchQuery(queryClient, getCountryById(supabase, id))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Country id={id} />
    </HydrationBoundary>
  )
}
