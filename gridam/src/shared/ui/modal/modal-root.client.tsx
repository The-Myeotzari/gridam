'use client'

import { Modal } from '@/shared/ui/modal/modal'
import { useModalStore } from '@/store/modal-store'

export default function ModalRoot() {
  const { node, close } = useModalStore()

  if (!node) return null

  return (
    <Modal open={true} onClose={close} size="md" closeOnBackdrop closeOnEscape>
      {node}
    </Modal>
  )
}
