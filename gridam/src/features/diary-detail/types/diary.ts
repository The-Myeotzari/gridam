export interface CreateDiaryPayload {
  content: string
  date: string
  emoji: string
  imageUrl?: string | null
  meta?: {
    timezone: string
  } | null
}

export interface DiaryImageData {
  path: string
  url: string | null
}
