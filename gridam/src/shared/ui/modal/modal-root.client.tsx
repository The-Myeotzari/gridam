'use client'

import { Modal } from '@/shared/ui/modal/modal'
import { useModalStore } from '@/store/modal-store'
import { useEffect } from 'react'

export default function ModalRoot() {
  const { node, close, size, isOpen } = useModalStore()
  const isModalOpen = isOpen()

  useEffect(() => {
    if (!isModalOpen) return

    history.pushState({ modal: true }, '')

    const handlePopState = () => {
      close()
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isModalOpen, close])

  if (!node) return null

  return (
    <Modal open={true} onClose={close} size={size} closeOnBackdrop closeOnEscape>
      {node}
    </Modal>
  )
}
