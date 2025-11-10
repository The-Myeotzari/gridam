import { create } from 'zustand'

interface LocationState {
  lat: number | null
  lon: number | null
  setLocation: (lat: number, lon: number) => void
  reset: () => void
}

export const useLocationStore = create<LocationState>((set) => ({
  lat: null,
  lon: null,
  setLocation: (lat, lon) => set({ lat, lon }),
  reset: () => set({ lat: null, lon: null }),
}))
