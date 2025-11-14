import { createMainLight } from '@/components/three/object/light'
import { getCSSColor } from '@/utils/get-css-color'
import * as THREE from 'three'

export type FlowerOptions = { size?: number }

export function createFlower({ size = 1 }: FlowerOptions = {}) {
  const fillColor = getCSSColor('--color-secondary')
  const centerColor = getCSSColor('--color-border')

  // 꽃 윤곽
  const basePts: THREE.Vector2[] = []
  for (let i = 0; i < 400; i++) {
    const t = (i / 400) * Math.PI * 2
    const r = 0.6 + 0.4 * (0.5 + 0.5 * Math.cos(5 * t))
    basePts.push(new THREE.Vector2(Math.cos(t) * r, Math.sin(t) * r))
  }

  // 입체 꽃
  const fillGeo = new THREE.ExtrudeGeometry(new THREE.Shape(basePts), {
    depth: 0.14,
    steps: 1,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 5,
    curveSegments: 128,
  })
  fillGeo.translate(0, 0, -0.07)
  fillGeo.computeVertexNormals()

  const fill = new THREE.Mesh(
    fillGeo,
    new THREE.MeshStandardMaterial({ color: fillColor, roughness: 0.35, metalness: 0.15 })
  )

  // 가운데 원
  const center = new THREE.Mesh(
    new THREE.CircleGeometry(0.16, 96),
    new THREE.MeshBasicMaterial({ color: centerColor, depthTest: false })
  )
  center.position.z = 0.08
  center.renderOrder = 2

  // 조명
  const amb = new THREE.AmbientLight(0xffffff, 0.6)
  const dir = createMainLight()

  const group = new THREE.Group()
  group.add(amb, dir, fill, center)
  group.scale.setScalar(size)
  return { group }
}
