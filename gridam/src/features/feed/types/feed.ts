export type GetDiaryParams = {
  year: string
  month: string
}

export type Diary = {
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
