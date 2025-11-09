'use client'

import { useModalStore } from '@/store/modal-store'
import { Modal } from '@/components/ui/modal/modal'

export default function ModalRoot() {
  const { node, close } = useModalStore()

  if (!node) return null

  return (
    <Modal
      open={true}
      onClose={close}
      size="md"
      closeOnBackdrop
      closeOnEscape
    >
      {node}
    </Modal>
  );
}