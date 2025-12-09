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

export const DIARY_STATUS = {
  NEW: 'new',
  DRAFT: 'draft',
  PUBLISHED: 'published',
} as const

export type DiaryStatus = (typeof DIARY_STATUS)[keyof typeof DIARY_STATUS]
