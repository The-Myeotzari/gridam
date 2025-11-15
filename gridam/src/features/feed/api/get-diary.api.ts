import { Diary } from '@/features/feed/types/feed'
import { api } from '@/lib/api'

type GetDiaryParams = {
  year: string
  month: string
}

export async function getDiary({ year, month }: GetDiaryParams): Promise<Diary[]> {
  const res = await api.get('/diaries', {
    params: { year, month },
  })

  const body = res.data

  if (!body || body.ok === false) {
    throw new Error(body?.message ?? '일기 불러오기 실패')
  }

  return (body.data ?? []) as Diary[]
}
