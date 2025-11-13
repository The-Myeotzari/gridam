export interface DiaryMeta {
  timezone: string
}

export interface CreateDiaryPayload {
  content: string
  date: string
  emoji: string
  imageUrl?: string | null
  meta?: DiaryMeta | null
}

export interface CreateDiaryResponse {
  data: { id: string } & CreateDiaryPayload
  ok: boolean
}
