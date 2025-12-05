'use client'

import { create } from 'zustand'
import type { ReactNode } from 'react'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

interface ModalState {
  /** 현재 열린 모달 노드 (없으면 null) */
  node: ReactNode | null
  opener: HTMLElement | null
  size: ModalSize
  /** 새로운 모달 열기 — 항상 기존 모달을 교체 (중첩 X) */
  open: (render: (close: () => void) => ReactNode, size?: ModalSize) => void
  /** 현재 모달 닫기 */
  close: () => void
  /** 현재 모달 열림 여부 */
  isOpen: () => boolean
}

export const useModalStore = create<ModalState>()((set, get) => ({
  node: null,
  size: 'md',
  opener: null,
  open: (render, size = 'md') => {
    const active = document.activeElement
    // render 함수로부터 닫기 함수 주입
    set(
      {
        opener: active instanceof HTMLElement ? active : null,
        node: render(() => get().close()),
        size,
      },
      false
    )
  },

  close: () => {
    const opener = get().opener
    set({ opener: null, node: null, size: 'md' }, false)
    if (opener && typeof opener.focus === 'function') {
      opener.focus()
    }
  },

  isOpen: () => get().node !== null,
}))

export const modalStore = {
  open: (render: (close: () => void) => ReactNode, size?: ModalSize) => {
    const { open } = useModalStore.getState()
    open(render, size)
  },
  close: () => {
    const { close } = useModalStore.getState()
    close()
  },
  isOpen: () => {
    const { isOpen } = useModalStore.getState()
    return isOpen()
  },
}
