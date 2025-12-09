import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import ThreeSpinner from '@/shared/ui/three/three-spinner'

type LoadingOverlayProps = {
  open: boolean
  label?: string
  progress: number
}

export default function LoadingOverlay({ open, label, progress }: LoadingOverlayProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[99]">
      {/* 배경 딤 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f3f4ff]/90 to-[#f6e9e5]/90" />

      {/* 스피너 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Canvas
          flat
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.NoToneMapping
          }}
          camera={{ position: [0, 0, 6], fov: 35 }}
          gl={{ alpha: true }}
          style={{ width: 320, height: 320 }}
        >
          <ambientLight intensity={1} />
          <directionalLight position={[3, 4, 5]} intensity={0.7} />
          <ThreeSpinner label={label} progress={progress} />
        </Canvas>
      </div>
    </div>
  )
}
