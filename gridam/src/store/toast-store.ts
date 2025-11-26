'use client'

import { Toast } from '@/shared/types/toast.type'
import { create } from 'zustand'

type ToastState = {
  items: Toast[]
  add: (toast: Omit<Toast, 'id'>) => void
  remove: (id: string) => void
}

const DEFAULT_DURATION = 3000 // 토스트 유지 기본값 3초

// Zustand 전역 상태
export const useToast = create<ToastState>((set, get) => ({
  items: [],

  // 새로운 토스트 추가
  add: (toast) => {
    const id: string = crypto.randomUUID()
    const item: Toast = { id, duration: DEFAULT_DURATION, ...toast }

    // 배열에 새 토스트 추가
    set((s) => ({ items: [...s.items, item] }))

    // duration이 존재하면 자동 삭제 타이머 실행
    if (item.duration) setTimeout(() => get().remove(id), item.duration)
  },

  // 특정 토스트 제거
  remove: (id) => set((s) => ({ items: s.items.filter((item) => item.id !== id) })),
}))

// 전역 호출 헬퍼
export const toast = {
  success: (msg: string) => useToast.getState().add({ message: msg, type: 'success' }),
  error: (msg: string) => useToast.getState().add({ message: msg, type: 'error' }),
}
