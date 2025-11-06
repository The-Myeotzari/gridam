import * as THREE from 'three'

// 렌더러 생성
export const CreateRenderer = (mount: HTMLDivElement) => {
  // antialias는 “계단 현상(거친 가장자리)”을 부드럽게 만들어주는 옵션
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(mount.clientWidth, mount.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  mount.appendChild(renderer.domElement)
  return renderer
}
