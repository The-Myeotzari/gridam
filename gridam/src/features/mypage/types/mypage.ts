export interface RecentDiary {
  id: string
  date: string
  weekday: string
  time: string
  content: string
  emoji: string
}

export interface Diary{
  id: string
  content: string
  created_at: string
  date: string
  deleted_at: string | null
  emoji: string | null
  image_url: string | null
  published_at: string | null
  status: 'draft' | 'published'
  updated_at: string
  user_id: string
}

export interface MonthlyDiaries {
  year: number
  month: number
  diaries: Diary[]
}

export type ApiResponse =
  | { ok: true; data: { message: string } }
  | { ok: false; message: string }
