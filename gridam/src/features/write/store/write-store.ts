import { create } from 'zustand'

type WriteState = {
  date: string
  canvas: string | null
  text: string

  setDate: (v: string) => void
  setCanvas: (v: string | null) => void
  setText: (v: string) => void

  reset: () => void
}

export const useWriteStore = create<WriteState>((set) => ({
  date: '',
  canvas: null,
  text: '',

  setDate: (v) => set({ date: v }),
  setCanvas: (v) => set({ canvas: v }),
  setText: (v) => set({ text: v }),

  reset: () => set({ date: '', canvas: null, text: '' }),
}))

export const useDate = () => useWriteStore((s) => s.date)
export const useCanvas = () => useWriteStore((s) => s.canvas)
export const useText = () => useWriteStore((s) => s.text)

export const useSetDate = () => useWriteStore((s) => s.setDate)
export const useSetCanvas = () => useWriteStore((s) => s.setCanvas)
export const useSetText = () => useWriteStore((s) => s.setText)
