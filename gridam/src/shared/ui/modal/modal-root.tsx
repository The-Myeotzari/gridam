import dynamic from 'next/dynamic'

const ModalRoot = dynamic(() => import('@/shared/ui/modal/modal-root.client'), { ssr: false })
export default function ModalRootWrapper() {
  return <ModalRoot />
}
