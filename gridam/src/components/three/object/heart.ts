import { createMainLight } from '@/components/three/object/light'
import { getCSSColor } from '@/utils/get-css-color'
import * as THREE from 'three'

export type HeartOptions = {
  size?: number
}

export function createHeart(opts: HeartOptions = {}) {
  const { size = 1 } = opts

  const fillColor = getCSSColor('--color-coral-pink')
  const edgeColor = getCSSColor('--color-sky-blue')

  const depth = 0.7
  const extrude: THREE.ExtrudeGeometryOptions = {
    steps: 2,
    depth,
    bevelThickness: 0.38,
    bevelSize: 0.43,
    bevelSegments: 18,
    curveSegments: 120,
  }

  // 하트 윤곽
  const shape = new THREE.Shape()
  shape.moveTo(0, 1.5)
  shape.bezierCurveTo(2, 3.5, 4, 1.5, 2, -0.5)
  shape.lineTo(0, -2.5)
  shape.lineTo(-2, -0.5)
  shape.bezierCurveTo(-4, 1.5, -2, 3.5, 0, 1.5)

  const geo = new THREE.ExtrudeGeometry(shape, extrude)
  geo.center()
  geo.translate(0, 0, -depth / 2)

  const mat = new THREE.MeshStandardMaterial({ color: fillColor })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.castShadow = false
  mesh.receiveShadow = false

  // 외곽선
  const egeo = new THREE.EdgesGeometry(geo, 20)
  const eline = new THREE.LineSegments(egeo, new THREE.LineBasicMaterial({ color: edgeColor }))
  eline.renderOrder = 1

  const group = new THREE.Group()
  group.name = 'heart'
  group.add(mesh)
  group.add(eline)

  const amb = new THREE.AmbientLight(0xffffff, 1)
  const dir = createMainLight()
  group.add(amb, dir)

  group.scale.setScalar(size)

  return { group }
}
