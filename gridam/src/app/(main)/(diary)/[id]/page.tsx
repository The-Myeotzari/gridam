import { MESSAGES } from '@/constants/messages'
import DiaryForm from '@/features/diary-detail/components/diary-form'
import DiaryLayout from '@/features/diary-detail/components/diary-layout'
import { formatDate } from '@/utils/format-date'
import getSupabaseServer from '@/utils/supabase/server'
import { withSignedImageUrls } from '@/utils/supabase/with-signed-image-urls'

async function getDiary(id: string) {
  const supabase = getSupabaseServer()
  const { data, error } = await (await supabase).from('diaries').select('*').eq('id', id).single()
  if (error) throw new Error(MESSAGES.DIARY.ERROR.READ)
  if (data?.image_url) {
    const signed = await withSignedImageUrls(await supabase, [data])
    return signed[0]
  }
  return data
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const diary = await getDiary(id)

  const dateValue = diary.date
  const formattedDate = formatDate(dateValue)
  const weatherIcon = diary.emoji ?? '/fallback-weather.png'

  return (
    <DiaryLayout date={formattedDate} weatherIcon={weatherIcon}>
      <DiaryForm
        dateValue={dateValue}
        weather={weatherIcon}
        isEdit={true}
        diaryId={diary.id}
        initialContent={diary.content}
        initialImage={diary.image_url}
      />
    </DiaryLayout>
  )
}
