'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

type ThreeSpinnerProps = {
  label?: string
  progress?: number // 0 ~ 100
}

/* 라운드 사각형 shape */
function createRoundedRectShape(width: number, height: number, radius: number) {
  const shape = new THREE.Shape()
  const w = width
  const h = height
  const r = radius

  shape.moveTo(-w / 2 + r, -h / 2)
  shape.lineTo(w / 2 - r, -h / 2)
  shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r)
  shape.lineTo(w / 2, h / 2 - r)
  shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2)
  shape.lineTo(-w / 2 + r, h / 2)
  shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r)
  shape.lineTo(-w / 2, -h / 2 + r)
  shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2)

  return shape
}

/* 가운데 꽃 (5잎 + 가운데 구멍) */
function createFlowerRingGeometry() {
  const petals = 5
  const baseRadius = 0.7
  const amplitude = 0.25
  const segments = 260

  const outer = new THREE.Shape()

  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2
    const r = baseRadius * (1 + amplitude * Math.cos(petals * t))
    const x = Math.cos(t) * r
    const y = Math.sin(t) * r

    if (i === 0) outer.moveTo(x, y)
    else outer.lineTo(x, y)
  }

  const innerRadius = 0.25
  const innerSegments = 72
  const inner = new THREE.Path()
  for (let i = 0; i <= innerSegments; i++) {
    const t = (i / innerSegments) * Math.PI * 2
    const x = Math.cos(t) * innerRadius
    const y = Math.sin(t) * innerRadius
    if (i === 0) inner.moveTo(x, y)
    else inner.lineTo(x, y)
  }
  outer.holes.push(inner)

  const geom = new THREE.ExtrudeGeometry(outer, {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.02,
    bevelSegments: 3,
  })
  geom.center()
  return geom
}

/* 코너용 작은 꽃 – 가운데 꽃이랑 비슷한 5잎, 채워진 버전 */
function createCornerFlowerGeometry() {
  const petals = 5
  const baseRadius = 0.2 // 살짝 더 작게
  const amplitude = 0.25
  const segments = 200

  const shape = new THREE.Shape()

  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2
    const r = baseRadius * (1 + amplitude * Math.cos(petals * t))
    const x = Math.cos(t) * r
    const y = Math.sin(t) * r
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 2,
  })
  geom.center()
  return geom
}

/* 코너용 하트 */
function createHeartGeometry(size: number) {
  const x = 0
  const y = 0
  const shape = new THREE.Shape()
  const s = size

  shape.moveTo(x, y + s * 0.35)
  shape.bezierCurveTo(x + s * 0.5, y + s * 0.9, x + s * 1.5, y + s * 0.1, x, y - s * 0.8)
  shape.bezierCurveTo(x - s * 1.5, y + s * 0.1, x - s * 0.5, y + s * 0.9, x, y + s * 0.35)

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 2,
  })
  geom.center()
  return geom
}

/* 카드 geometry */
const CARD_WIDTH = 3.4
const CARD_HEIGHT = 3.4
const CARD_DEPTH = 0.18

const cardShape = createRoundedRectShape(CARD_WIDTH, CARD_HEIGHT, 0.4)
const cardGeometry = new THREE.ExtrudeGeometry(cardShape, {
  depth: CARD_DEPTH,
  bevelEnabled: true,
  bevelThickness: 0.05,
  bevelSize: 0.05,
  bevelSegments: 4,
})
cardGeometry.center()

/* 로딩바 geometry */
const BAR_WIDTH = 2.6
const BAR_HEIGHT = 0.36
const BAR_RADIUS = BAR_HEIGHT / 2
const BAR_DEPTH = 0.04

const BORDER = 0.05

const outerBarShape = createRoundedRectShape(BAR_WIDTH, BAR_HEIGHT, BAR_RADIUS)
const outerBarGeometry = new THREE.ExtrudeGeometry(outerBarShape, {
  depth: BAR_DEPTH,
  bevelEnabled: false,
})
outerBarGeometry.center()

const innerBarShape = createRoundedRectShape(
  BAR_WIDTH - BORDER * 2,
  BAR_HEIGHT - BORDER * 2,
  BAR_RADIUS - BORDER
)
const innerBarGeometry = new THREE.ExtrudeGeometry(innerBarShape, {
  depth: BAR_DEPTH * 0.9,
  bevelEnabled: false,
})
innerBarGeometry.center()

const fillBarShape = createRoundedRectShape(
  BAR_WIDTH - BORDER * 2,
  BAR_HEIGHT - BORDER * 2,
  BAR_RADIUS - BORDER
)
const fillBarGeometry = new THREE.ExtrudeGeometry(fillBarShape, {
  depth: BAR_DEPTH * 0.8,
  bevelEnabled: false,
})
fillBarGeometry.center()

const FILL_WIDTH = BAR_WIDTH - BORDER * 2

/* 코너 장식 geometry */
const cornerFlowerGeometry = createCornerFlowerGeometry()
const cornerHeartGeometry = createHeartGeometry(0.25)
const flowerRingGeometry = createFlowerRingGeometry()

// 코너 공통 크기/위치 조절
const CORNER_SCALE = 0.72
const CORNER_OFFSET = 0.12 // 값 줄여서 좀 더 밖으로

export default function ThreeSpinner({
  label = '일기 가져오는 중...',
  progress = 0,
}: ThreeSpinnerProps) {
  const rootRef = useRef<THREE.Group>(null)
  const barFillGroupRef = useRef<THREE.Group>(null)
  const flowerRef = useRef<THREE.Group>(null)

  const clamped = Math.max(0, Math.min(100, progress))
  const targetRatio = clamped / 100

  useFrame((_, delta) => {
    if (barFillGroupRef.current) {
      const current = barFillGroupRef.current.scale.x
      const next = THREE.MathUtils.lerp(current, targetRatio, 1 - Math.pow(0.001, delta * 60))
      barFillGroupRef.current.scale.x = next
    }

    if (flowerRef.current) {
      flowerRef.current.rotation.z += 0.6 * delta
    }
  })

  // 카드 앞면보다 살짝 위로 – 테두리 덮게
  const cornerZ = CARD_DEPTH / 2 + 0.12

  return (
    <group ref={rootRef}>
      {/* 카드 */}
      <mesh geometry={cardGeometry} position={[0, 0, 0]}>
        <meshBasicMaterial color="#A5B7AE" />
      </mesh>

      <mesh geometry={cardGeometry} position={[0, 0, 0.01]} scale={[0.97, 0.97, 1]}>
        <meshBasicMaterial color="#FEF1D1" />
      </mesh>

      {/* === 코너 장식들 (전부 같은 스케일) === */}

      {/* 왼쪽 위 꽃 */}
      <group
        position={[
          -CARD_WIDTH / 2 + CORNER_OFFSET, // offset 줄여서 바깥쪽으로
          CARD_HEIGHT / 2 - CORNER_OFFSET,
          cornerZ,
        ]}
        scale={[CORNER_SCALE, CORNER_SCALE, 1]}
      >
        <mesh geometry={cornerFlowerGeometry}>
          <meshBasicMaterial color="#C7E5C8" />
        </mesh>
      </group>

      {/* 오른쪽 위 하트 */}
      <group
        position={[CARD_WIDTH / 2 - CORNER_OFFSET, CARD_HEIGHT / 2 - CORNER_OFFSET, cornerZ]}
        scale={[CORNER_SCALE, CORNER_SCALE, 1]}
      >
        <mesh geometry={cornerHeartGeometry}>
          <meshBasicMaterial color="#C7B4E6" />
        </mesh>
      </group>

      {/* 왼쪽 아래 하트 */}
      <group
        position={[-CARD_WIDTH / 2 + CORNER_OFFSET, -CARD_HEIGHT / 2 + CORNER_OFFSET, cornerZ]}
        scale={[CORNER_SCALE, CORNER_SCALE, 1]}
      >
        <mesh geometry={cornerHeartGeometry}>
          <meshBasicMaterial color="#C7B4E6" />
        </mesh>
      </group>

      {/* 가운데 회전하는 꽃 */}
      <group ref={flowerRef} position={[0, 0.65, CARD_DEPTH / 2 + 0.06]}>
        <mesh geometry={flowerRingGeometry}>
          <meshBasicMaterial color="#FECCAE" />
        </mesh>
      </group>

      {/* 텍스트 */}
      <Text
        position={[0, -0.5, CARD_DEPTH / 2 + 0.08]}
        fontSize={0.22}
        color="#8F7A9C"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>

      {/* 로딩바 */}
      <group position={[0, -1.1, CARD_DEPTH / 2 + 0.08]}>
        <mesh geometry={outerBarGeometry}>
          <meshBasicMaterial color="#E79A85" />
        </mesh>

        <mesh geometry={innerBarGeometry} position={[0, 0, 0.01]}>
          <meshBasicMaterial color="#FEF1D1" />
        </mesh>

        <group ref={barFillGroupRef} position={[-FILL_WIDTH / 2, 0, 0.02]} scale={[0, 1, 1]}>
          <mesh geometry={fillBarGeometry} position={[FILL_WIDTH / 2, 0, 0]}>
            <meshBasicMaterial color="#F8B39A" />
          </mesh>
        </group>
      </group>
    </group>
  )
}
