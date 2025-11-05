import * as THREE from 'three'

export type CubeOptions = {
  size?: number
  color?: number | string
}

// 큐브 생성
export const createCube = ({ size = 1, color = 0x0070f3 }: CubeOptions = {}) => {
  const geo = new THREE.BoxGeometry(size, size, size)
  const mat = new THREE.MeshStandardMaterial({ color })
  const mesh = new THREE.Mesh(geo, mat)
  return { mesh, geo, mat }
}
