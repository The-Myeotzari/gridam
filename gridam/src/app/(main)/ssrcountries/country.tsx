'use client'

// import useSupabaseBrowser from '@/utils/supabase/client'

export default function Country({ id }: { id: number }) {
  // const supabase = useSupabaseBrowser()
  // This useQuery could just as well happen in some deeper
  // child to <Posts>, data will be available immediately either way
  // const { data: country } = useQuery(getCountryById(supabase, id))

  return (
    <div>
      <h1>SSR: </h1>
    </div>
  )
}
