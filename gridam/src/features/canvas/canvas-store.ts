import { create } from 'zustand'

type CanvasStore = {
  image: string | null
  setImage: (img: string | null) => void
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  image: null,
  setImage: (img) => set({ image: img }),
}))
