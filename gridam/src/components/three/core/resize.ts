import type * as THREE from 'three'

export const AddResizeListener = (
  mount: HTMLDivElement,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) => {
  // 리사이즈 대응
  const handler = () => {
    camera.aspect = mount.clientWidth / mount.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(mount.clientWidth, mount.clientHeight)
  }
  window.addEventListener('resize', handler)
  return () => window.removeEventListener('resize', handler)
}
