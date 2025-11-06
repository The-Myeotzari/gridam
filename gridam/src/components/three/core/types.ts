import * as THREE from 'three'

export type SceneConfig = {
  background?: number | string | null
}

export type CameraConfig = {
  fov?: number
  near?: number
  far?: number
  position?: { x?: number; y?: number; z?: number }
}

export type RendererConfig = {
  antialias?: boolean
  pixelRatio?: number
}

export type ThreeContext = {
  mount: HTMLDivElement
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
}

export type ReadyCallback = (ctx: ThreeContext) => void
export type FrameCallback = (delta: number, ctx: ThreeContext) => void
