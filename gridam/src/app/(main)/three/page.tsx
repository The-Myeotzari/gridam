'use client'

import ThreeFireworks from '@/shared/ui/three/three-firewors'
import PostitMesh from '@/shared/ui/three/three-postit'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

export default function CelebrationPostit() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 0, 2.4] }} // 원래 포스트잇 카메라
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NoToneMapping
          gl.outputColorSpace = THREE.SRGBColorSpace
        }}
      >
        {/* 라이트 */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 4, 4]} intensity={0.8} />

        {/* 폭죽 : 포스트잇 뒤쪽 */}
        <ThreeFireworks />

        {/* 포스트잇 : 크기만 살짝 줄여서 */}
        <PostitMesh
          title="첫 글 작성 성공!"
          subtitle="오늘의 기록을 남겼어요"
          badgeText="1"
          floatSpeed={0.6}
        />
      </Canvas>
    </div>
  )
}
