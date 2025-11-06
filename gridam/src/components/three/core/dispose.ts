import * as THREE from 'three'

// 장면 정리하여 메모리 해제하기 -> 메모리 누수 방지
export const DisposeSceneDeep = (scene: THREE.Scene) => {
  scene.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh
      mesh.geometry?.dispose()
      if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose())
      else mesh.material?.dispose?.()
    }
  })
}
