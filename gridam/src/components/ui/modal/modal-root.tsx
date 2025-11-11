import dynamic from 'next/dynamic'

const ModalRoot = dynamic(() => import('@/components/ui/modal/modal-root.client'), { ssr: false })
export default function ModalRootWrapper() {
  return <ModalRoot />
}
