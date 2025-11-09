import * as THREE from 'three'
import { createMainLight } from './light'

export type LoadingBarOptions = {
  width?: number
  height?: number
  radius?: number
  depth?: number
  color?: string
  bgColor?: string
  progress?: number
  lerpSpeed?: number
}

export function createLoadingBar(opts: LoadingBarOptions = {}) {
  const {
    width = 3.0,
    height = 0.36,
    radius = 0.18,
    depth = 0.14,
    color = '#60a5fa', // fill
    bgColor = '#111827',
    progress = 0,
    lerpSpeed = 10,
  } = opts

  const group = new THREE.Group()
  group.name = 'LoadingBar'

  const shape = new THREE.Shape()
  const w = width
  const h = height
  const r = Math.min(radius, Math.min(w, h) / 2)

  shape.moveTo(-w / 2 + r, -h / 2)
  shape.lineTo(w / 2 - r, -h / 2)
  shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r)
  shape.lineTo(w / 2, h / 2 - r)
  shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2)
  shape.lineTo(-w / 2 + r, h / 2)
  shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r)
  shape.lineTo(-w / 2, -h / 2 + r)
  shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2)

  const extrude = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false,
  })
  extrude.center()

  // background frame
  const bgMat = new THREE.MeshStandardMaterial({ color: bgColor, metalness: 0.1, roughness: 0.9 })
  const bg = new THREE.Mesh(extrude, bgMat)
  bg.name = 'LoadingBar-bg'
  group.add(bg)

  // fill: a simple box we scale on X inside the frame
  const fillGeom = new THREE.BoxGeometry(
    width - r * 0.8,
    height - r * 0.8,
    Math.max(0.02, depth * 0.6)
  )
  const fillMat = new THREE.MeshStandardMaterial({ color, metalness: 0.2, roughness: 0.5 })
  const fill = new THREE.Mesh(fillGeom, fillMat)
  fill.position.z = 0.01
  fill.name = 'LoadingBar-fill'
  group.add(fill)

  const amb = new THREE.AmbientLight(0xffffff, 0.6)
  const dir = createMainLight()
  group.add(amb, dir)

  // internal state
  let target = THREE.MathUtils.clamp(progress, 0, 1)
  let current = target

  // Apply visual scale from current value
  const applyScale = (v: number) => {
    // minimum sliver so it’s visible when >0
    const minX = 0.02
    const sx = minX + (1 - minX) * v
    fill.scale.x = sx
    // anchor left: move fill so left edge stays aligned
    fill.position.x = -((width - r * 0.8) * (1 - sx)) / 2
  }

  applyScale(current)

  const setProgress = (p: number) => {
    target = THREE.MathUtils.clamp(p, 0, 1)
  }

  const tick = (delta: number) => {
    const t = Math.min(1, lerpSpeed * delta)
    current = THREE.MathUtils.lerp(current, target, t)
    applyScale(current)
  }

  const dispose = () => {
    extrude.dispose()
    fillGeom.dispose()
    bgMat.dispose()
    fillMat.dispose()
  }

  return { group, setProgress, tick, dispose }
}
