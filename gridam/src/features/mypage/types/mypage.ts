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