export type GetDiaryParams = {
  year: string
  month: string
  status?: string
  cursor?: string | null
  limit?: number
}

export type DiaryPage = {
  items: Diary[]
  nextCursor: string | null
  hasMore: boolean
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
