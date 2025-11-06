'use client'

import type { CameraConfig, RendererConfig, SceneConfig } from '@/components/three/core/types'
import { useThree } from '@/hooks/useThree'
import React, { useRef } from 'react'

// 3D를 리액트 앱에 띄우기 위한 용도
// "Three.js용 캔버스"를 React 컴포넌트로 만든 파일

export type ThreeCanvasProps = {
  className?: string
  style?: React.CSSProperties
  scene?: SceneConfig
  camera?: CameraConfig
  renderer?: RendererConfig
  onReady?: NonNullable<Parameters<typeof useThree>[1]>['onReady']
  onFrame?: NonNullable<Parameters<typeof useThree>[1]>['onFrame']
}

export default function ThreeCanvas(props: ThreeCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null)

  // scene, camera, renderer를 초기화하고
  useThree(mountRef as React.RefObject<HTMLDivElement>, {
    scene: props.scene,
    camera: props.camera,
    renderer: props.renderer,
    onReady: props.onReady,
    onFrame: props.onFrame,
  })

  const style: React.CSSProperties = {
    width: '100%',
    height: '100vh',
    ...(props.style ?? {}),
  }

  return React.createElement('div', {
    ref: mountRef,
    className: props.className,
    style,
  })
}
