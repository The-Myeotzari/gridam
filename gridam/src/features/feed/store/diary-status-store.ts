import { create } from 'zustand'

export type Status = 'published' | 'draft' | 'none'

interface TodayDiaryStatusStore {
  status: Status
  setStatus: (s: Status) => void
}

export const useDiaryStatusStore = create<TodayDiaryStatusStore>((set) => ({
  status: 'none',
  setStatus: (s) => set({ status: s }),
}))
