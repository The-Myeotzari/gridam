'use client'

import { useMemo, useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Props = {
  // 애니메이션 지속 시간
  duration?: number
  // 포스트잇 뒤에 숨기기 위해 z축 조절용 위치
  position?: [number, number, number]
}

const PARTICLE_COUNT = 320

//  동그란 파티클 텍스처 생성
//  - 네모 스프라이트가 아니라
//    알파가 적용된 하얀 원 텍스처를 만든다.

function createCircleTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, size, size)

  // 가운데 동그라미
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  ctx.fill()

  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

//  폭죽 파티클 구현 컴포넌트
//  - center(0,0,0) 에서 모든 파티클을 쏘아 올린 뒤
//    velocities 배열로 속도/방향을 고정해두고
//    매 프레임 position 에 더해주는 방식.

export default function ThreeFireworks({ duration = 2.2, position = [0, 0, -0.2] }: Props) {
  const pointsRef = useRef<THREE.Points>(null)

  // 동그란 스프라이트 텍스처 (한 번만 생성)
  const circleTexture = useMemo(() => createCircleTexture(), [])

  // 초기 파티클 데이터 생성
  // positions: 파티클 위치
  // colors: 각 파티클 색상
  // velocities: 각 파티클 방향 + 속도 벡터
  // 초기 파티클 생성 (최초 마운트 시 한 번만 랜덤 계산)
  const [{ positions, colors, velocities }] = useState(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)
    const velocities: THREE.Vector3[] = []

    const colorA = new THREE.Color('#FFB3C6') // 핑크
    const colorB = new THREE.Color('#C6ECE4') // 민트
    const colorC = new THREE.Color('#FDE4A6') // 옐로우
    const palette = [colorA, colorB, colorC]

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3

      // 시작 위치 (폭죽의 중심)
      positions[idx] = 0
      positions[idx + 1] = 0
      positions[idx + 2] = 0

      // 색상: 팔레트 3개를 순환
      const c = palette[i % palette.length]
      colors[idx] = c.r
      colors[idx + 1] = c.g
      colors[idx + 2] = c.b

      // 방향 벡터
      const direction = new THREE.Vector3(
        (Math.random() - 0.5) * 2, // 좌우 -1~1
        Math.random() * 2, // 위쪽 0~2
        (Math.random() - 0.5) * 2 // 앞뒤 -1~1
      ).normalize()

      // 속도는 1.5 ~ 2.7 사이
      const speed = 1.5 + Math.random() * 2.2
      direction.multiplyScalar(speed)

      velocities.push(direction)
    }

    return { positions, colors, velocities }
  })

  // 애니메이션 진행 시간 (초 단위)
  const [time, setTime] = useState(0)

  // 컴포넌트가 마운트 될 때마다 time 을 0으로 리셋
  useEffect(() => {
    setTime(0)
  }, [])

  useFrame((_, delta) => {
    const points = pointsRef.current
    if (!points) return

    const geometry = points.geometry as THREE.BufferGeometry
    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute

    const t = time + delta
    setTime(t)

    // 중력 가속도 느낌 (y축으로 아래로 끌어내림)
    const gravity = -3.2

    // 각 파티클 위치 업데이트
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3

      const v = velocities[i]

      // vy 에만 중력 효과 추가
      const vx = v.x
      const vy = v.y + gravity * t * 0.4
      const vz = v.z

      // delta 만큼 이동 (프레임 간 시간 보정)
      posAttr.array[idx] += vx * delta
      posAttr.array[idx + 1] += vy * delta
      posAttr.array[idx + 2] += vz * delta
    }

    posAttr.needsUpdate = true

    // Fade-out 처리: duration 의 60% 이후부터 서서히 투명해짐
    const material = points.material as THREE.PointsMaterial
    const fadeStart = duration * 0.6
    const fadeEnd = duration

    if (t > fadeStart) {
      const alpha = 1 - Math.min(1, (t - fadeStart) / (fadeEnd - fadeStart))
      material.opacity = alpha
      material.needsUpdate = true
    }

    // duration 이 지났으면 완전 투명
    if (t >= duration) {
      material.opacity = 0
      material.needsUpdate = true
    }
  })

  return (
    <group position={position}>
      <points ref={pointsRef}>
        <bufferGeometry>
          {/* position attribute: 파티클 좌표 */}
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          {/* color attribute: 정점별 색상 */}
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>

        <pointsMaterial
          size={0.09} // 파티클 크기
          map={circleTexture} // 원형 텍스처
          vertexColors
          transparent
          opacity={1}
          depthWrite={false} // 뒤쪽 파티클까지 보이게
          sizeAttenuation // 원근에 따라 크기 조절
          alphaTest={0.3} // 원형 부분만 남기고 나머지 잘라내기
        />
      </points>
    </group>
  )
}
