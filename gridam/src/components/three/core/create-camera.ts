import * as THREE from 'three'

// 카메라 생성
export const CreateCamera = (mount: HTMLDivElement) => {
  const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000)
  camera.position.set(0, 0, 3)
  return camera
}
