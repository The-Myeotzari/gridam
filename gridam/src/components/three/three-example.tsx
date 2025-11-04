'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeExample() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // 장면(Scene)
    const scene = new THREE.Scene()

    // 카메라(Camera)
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 3

    // 렌더러(Renderer)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    mount.appendChild(renderer.domElement)

    // 큐브 생성
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({ color: 0x0070f3 })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    // 조명 추가
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(3, 3, 3)
    scene.add(light)

    // 애니메이션 루프
    const animate = () => {
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate()

    // 리사이즈 대응
    const handleResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // 정리(cleanup)
    return () => {
      window.removeEventListener('resize', handleResize)
      mount.removeChild(renderer.domElement)
      geometry.dispose()
      material.dispose()
    }
  }, [])

  return <div ref={mountRef} style={{ width: '100%', height: '100vh', background: '#000' }} />
}
