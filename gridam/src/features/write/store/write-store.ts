import { create } from 'zustand'

type WriteState = {
  date: string
  text: string
  setDate: (v: string) => void
  setText: (v: string) => void
}

export const useWriteStore = create<WriteState>((set) => ({
  date: '',
  text: '',
  setDate: (v) => set({ date: v }),
  setText: (v) => set({ text: v }),
}))

export const useDate = () => useWriteStore((s) => s.date)
export const useText = () => useWriteStore((s) => s.text)

export const useSetDate = () => useWriteStore((s) => s.setDate)
export const useSetText = () => useWriteStore((s) => s.setText)
