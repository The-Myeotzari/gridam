'use client'

import { create } from 'zustand'

type Snapshot = ImageData

type CanvasState = {
  color: string
  isEraser: boolean
  // 히스토리 스택
  history: Snapshot[]
  maxHistory: number
  // 액션
  setColor: (color: string) => void
  setIsEraser: (v: boolean) => void
  toggleEraser: () => void
  // 스냅샷 관리
  pushSnapshot: (snap: Snapshot) => void
  undo: () => Snapshot | null
  clearHistory: () => void
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  color: 'var(--color-canva-red)',
  isEraser: false,

  history: [],
  maxHistory: 50,

  setColor: (color) => set({ color, isEraser: false }),
  setIsEraser: (v) => set({ isEraser: v }),
  toggleEraser: () => set((s) => ({ isEraser: !s.isEraser })),

  pushSnapshot: (snap) =>
    set((s) => {
      const next = [...s.history, snap]
      if (next.length > s.maxHistory) next.shift()
      return { history: next }
    }),

  undo: () => {
    const { history } = get()
    if (history.length <= 1) return null
    const next = history.slice(0, -1)
    const last = next[next.length - 1]
    set({ history: next })
    return last
  },

  clearHistory: () => set({ history: [] }),
}))
