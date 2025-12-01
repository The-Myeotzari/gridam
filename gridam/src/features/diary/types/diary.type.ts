export interface CreateDiaryPayload {
  content: string
  date: string
  emoji: string
  imageUrl?: string | null
  meta?: {
    timezone: string
  } | null
}

export type UpdateDiaryPayload = {
  id: string
  content: string
  imageUrl: string | null
}

export interface DiaryImageData {
  path: string
  url: string | null
}
