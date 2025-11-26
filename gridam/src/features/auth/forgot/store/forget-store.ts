import { create } from 'zustand'

interface ForgotPasswordState {
  email: string
  isSubmitted: boolean
  setEmail: (email: string) => void
  setSubmitted: (v: boolean) => void
  reset: () => void
}

export const useForgotPasswordStore = create<ForgotPasswordState>((set) => ({
  email: '',
  isSubmitted: false,
  setEmail: (email) => set({ email }),
  setSubmitted: (v) => set({ isSubmitted: v }),
  reset: () => set({ email: '', isSubmitted: false }),
}))
