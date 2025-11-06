'use client'

import { CreateCamera } from '@/components/three/core/create-camera'
import { CreateRenderer } from '@/components/three/core/create-renderer'
import { CreateScene } from '@/components/three/core/create-scene'
import { DisposeSceneDeep } from '@/components/three/core/dispose'
import { AddResizeListener } from '@/components/three/core/resize'
import type {
  CameraConfig,
  FrameCallback,
  ReadyCallback,
  RendererConfig,
  SceneConfig,
} from '@/components/three/core/types'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export const useThree = (
  mountRef: React.RefObject<HTMLDivElement>,
  opts?: {
    scene?: SceneConfig
    camera?: CameraConfig
    renderer?: RendererConfig
    onReady?: ReadyCallback
    onFrame?: FrameCallback
  }
) => {
  const stopRef = useRef<() => void>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = CreateScene()
    const camera = CreateCamera(mount)
    const renderer = CreateRenderer(mount)

    opts?.onReady?.({ mount, scene, camera, renderer })

    const clock = new THREE.Clock()
    let rafId = 0
    // 애니메이션 루프
    const animate = () => {
      const delta = clock.getDelta()
      opts?.onFrame?.(delta, { mount, scene, camera, renderer })
      renderer.render(scene, camera)
      rafId = requestAnimationFrame(animate)
    }
    animate()

    // 리사이즈 대응
    const offResize = AddResizeListener(mount, camera, renderer)

    // 초기화
    stopRef.current = () => {
      cancelAnimationFrame(rafId)
      offResize()
      DisposeSceneDeep(scene)
      renderer.dispose()
      if (renderer.domElement && renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement)
      }
    }

    return () => stopRef.current?.()
  }, [])
}
