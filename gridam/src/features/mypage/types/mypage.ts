export interface UserStats {
  user: {
    id: string
    email: string
    nickname: string
    created_at: string
  }
  stats: {
    totalDiaries: number
    totalDays: number
  }
  recentDiaries: {
    id: string
    date: string
    weekday: string
    time: string
    content: string
    weatherEmoji: string
  }[]
}

export interface RecentDiary {
  id: string
  date: string
  weekday: string
  time: string
  content: string
  emoji: string
}

export interface ChangePasswordState {
  ok: boolean,
  message?: string
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