'use client'

import type { CameraConfig, RendererConfig, SceneConfig } from '@/components/three/core/types'
import { createSpinner, type SpinnerOptions } from '@/components/three/object/spinner'
import ThreeCanvas from '@/components/three/three-canvas'
import React from 'react'

export type ThreeSpinnerProps = {
  className?: string
  style?: React.CSSProperties
  scene?: SceneConfig
  camera?: CameraConfig
  renderer?: RendererConfig
  spinner?: SpinnerOptions & { speed?: number }
}

export default function ThreeSpinner({
  className,
  style,
  scene,
  camera,
  renderer,
  spinner,
}: ThreeSpinnerProps) {
  const speed = spinner?.speed ?? 1.6

  return (
    <ThreeCanvas
      className={className}
      style={{ width: '100%', height: '240px', ...(style || {}) }}
      scene={{ ...(scene || {}) }}
      camera={{ position: { z: 2.2 }, ...(camera || {}) }}
      renderer={{ antialias: true, ...(renderer || {}) }}
      onReady={({ scene }) => {
        // 포스트잇, 폭죽
        const { group } = createSpinner({ variant: 'ring', size: 1, color: 0x00d8ff, ...spinner })
        scene.add(group)
      }}
      onFrame={(delta, { scene }) => {
        // 폭죽의 애니메이션 갱신
        const group = scene.children.find((c) => c.type === 'Group') // type 혹은 name 지정 가능
        if (group) {
          group.rotation.z -= speed * delta
        }
      }}
    />
  )
}
