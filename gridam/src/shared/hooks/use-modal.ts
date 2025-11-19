'use client'

import { useModalStore } from '@/store/modal-store'
import type { ReactNode } from 'react'

export function useModal() {
  const { open, close, isOpen } = useModalStore()

  return {
    /** 모달 열기 — render 함수로 ReactNode 반환 */
    open: (render: (close: () => void) => ReactNode) => open(render),
    /** 모달 닫기 */
    close,
    /** 열림 여부 확인 */
    isOpen,
  }
}
