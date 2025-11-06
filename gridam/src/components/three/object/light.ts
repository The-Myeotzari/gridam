import * as THREE from 'three'

// 조명 추가
export const createMainLight = () => {
  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(3, 3, 3)
  return light
}
