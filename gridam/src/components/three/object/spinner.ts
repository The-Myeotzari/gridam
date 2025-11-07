import * as THREE from 'three'

export type SpinnerVariant = 'ring' | 'dots' | 'bars'

export type SpinnerOptions = {
  variant?: SpinnerVariant
  size?: number // 전체 스케일
  color?: number | string
  count?: number // dots/bars 개수
  radius?: number // 원형 반지름
  thickness?: number // ring 두께 or bar 굵기
}

export const createSpinner = ({
  variant = 'ring',
  size = 1,
  color = 0x00d8ff,
  count = 12,
  radius = 0.6,
  thickness = 0.12,
}: SpinnerOptions = {}) => {
  const group = new THREE.Group()
  group.scale.setScalar(size)

  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.1 })

  if (variant === 'ring') {
    const geo = new THREE.TorusGeometry(radius, thickness, 16, 64)
    const mesh = new THREE.Mesh(geo, material)
    group.add(mesh)
  } else if (variant === 'dots') {
    const geo = new THREE.SphereGeometry(thickness * 0.9, 16, 16)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      const m = new THREE.Mesh(geo, material.clone())
      // 점점 투명도 차이를 주어 회전 시 진짜 로딩 느낌
      m.position.set(x, y, 0)
      m.material.transparent = true
      m.material.opacity = 0.4 + 0.6 * (i / count)
      group.add(m)
    }
  } else if (variant === 'bars') {
    const geo = new THREE.BoxGeometry(thickness * 0.7, radius * 0.9, thickness * 0.7)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const holder = new THREE.Object3D()
      holder.rotation.z = angle
      const m = new THREE.Mesh(geo, material.clone())
      m.position.y = radius * 0.5
      m.material.transparent = true
      m.material.opacity = 0.4 + 0.6 * (i / count)
      holder.add(m)
      group.add(holder)
    }
  }

  // 기본 라이트(살짝만)
  const light = new THREE.AmbientLight(0xffffff, 0.7)
  group.add(light)

  const dir = new THREE.DirectionalLight(0xffffff, 0.6)
  dir.position.set(2, 2, 3)
  group.add(dir)

  return { group }
}
