'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 색상 상수
const PAPER_OUTLINE = '#FFEBC1'
const PAPER_FILL = '#FFF7DD'
const TEXT_MAIN = '#B693C6'
const BADGE_BG = '#C6ECE4'
const TAPE_FILL = '#DAB9EC'
const TAPE_BORDER = '#B482CB'

//  포스트잇 텍스처 생성
//  - HTML canvas 위에 직접 그림을 그리고
//    그 결과를 THREE.CanvasTexture 로 만들어서
//    BoxGeometry 앞면에 붙인다.
function createPostitTexture(title: string, subtitle?: string, badgeText?: string) {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // 전체 배경 (모서리 검은 줄 방지)
  // 캔버스 전체를 먼저 칠해두면 텍스처 경계에서 검은 테두리가 생기는 문제를 줄일 수 있다.
  ctx.fillStyle = PAPER_OUTLINE
  ctx.fillRect(0, 0, size, size)

  // 안쪽 네모 + 보더
  const pad = size * 0.015
  const x = pad
  const y = pad
  const w = size - pad * 2
  const h = size - pad * 2

  // 실제 포스트잇 영역
  ctx.fillStyle = PAPER_FILL
  ctx.fillRect(x, y, w, h)

  // 테두리
  ctx.lineWidth = 6
  ctx.strokeStyle = PAPER_OUTLINE
  ctx.strokeRect(x, y, w, h)

  // 텍스트 기본 설정
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = TEXT_MAIN

  // 제목
  ctx.font = '700 112px "ZEN Serif", serif'
  ctx.fillText(title, size / 2, size * 0.33)

  // 부제목이 있을 때만 렌더링
  if (subtitle) {
    ctx.font = '500 68px "ZEN Serif", serif'
    ctx.fillText(subtitle, size / 2, size * 0.5)
  }

  // 배지(원형) 영역
  if (badgeText) {
    const cx = size / 2
    const cy = size * 0.74

    // 배지 배경 원
    ctx.fillStyle = BADGE_BG
    ctx.beginPath()
    ctx.arc(cx, cy, 100, 0, Math.PI * 2)
    ctx.fill()

    // 배지 안 텍스트
    ctx.fillStyle = TEXT_MAIN
    ctx.font = '700 68px "ZEN Serif", serif'
    ctx.fillText(badgeText, cx, cy)
  }

  // 캔버스를 THREE 텍스처로 변환
  const tex = new THREE.CanvasTexture(canvas)

  // 종이 느낌을 살리기 위해 mipmap 없이, 선형 필터 사용
  tex.generateMipmaps = false
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

//  찢긴 느낌의 테이프 텍스처 생성
//  - 양쪽 끝을 지그재그로 그려서
//    마스킹테이프 찢긴 느낌을 만든다.

function createTapeTexture() {
  const width = 512
  const height = 256
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, width, height)

  // 테이프의 전체 윤곽을 구성하는 기준 좌표들
  const padX = width * 0.1
  const topY = height * 0.28
  const bottomY = height * 0.72
  const sideHeight = bottomY - topY

  const segments = 3 // 지그재그 개수
  const notchX = width * 0.025 // 안/밖으로 튀어나오는 정도

  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  ctx.beginPath()

  // 위쪽 직선
  ctx.moveTo(padX, topY)
  ctx.lineTo(width - padX, topY)

  // 오른쪽 세로 지그재그
  const xInnerRight = width - padX
  const xOuterRight = width - padX + notchX
  for (let i = 0; i < segments; i++) {
    const yMid = topY + (sideHeight * (i + 0.5)) / segments
    const yNext = topY + (sideHeight * (i + 1)) / segments
    ctx.lineTo(xOuterRight, yMid)
    ctx.lineTo(xInnerRight, yNext)
  }

  // 아래 직선
  ctx.lineTo(padX, bottomY)

  // 왼쪽 세로 지그재그 (반대 방향으로 올라오게)
  const xInnerLeft = padX
  const xOuterLeft = padX - notchX
  for (let i = segments - 1; i >= 0; i--) {
    const yMid = topY + (sideHeight * (i + 0.5)) / segments
    const yPrev = topY + (sideHeight * i) / segments
    ctx.lineTo(xOuterLeft, yMid)
    ctx.lineTo(xInnerLeft, yPrev)
  }

  ctx.closePath()

  // 테이프 내부 색, 외곽선
  ctx.fillStyle = TAPE_FILL
  ctx.strokeStyle = TAPE_BORDER
  ctx.lineWidth = 10
  ctx.stroke()
  ctx.fill()

  const tex = new THREE.CanvasTexture(canvas)
  tex.generateMipmaps = false
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

//  포스트잇 3D Mesh 생성 (THREE.Group)
//  - BoxGeometry로 포스트잇 두께를 만들고
//    앞면에만 텍스처를 붙임.
//  - 위쪽에 테이프 Plane 을 하나 더 올린다.

function createPostitMesh(title: string, subtitle?: string, badgeText?: string) {
  const group = new THREE.Group()

  // 포스트잇 실제 크기 (월드 좌표계 기준)
  const width = 2.4
  const height = 2.4
  const depth = 0.08

  const texture = createPostitTexture(title, subtitle, badgeText)

  // 앞면은 캔버스 텍스처, 나머지 면은 단색
  const frontMat = new THREE.MeshBasicMaterial({ map: texture })
  const sideMat = new THREE.MeshBasicMaterial({ color: PAPER_FILL })

  const materials = [
    sideMat, // +x
    sideMat, // -x
    sideMat, // +y
    sideMat, // -y
    frontMat, // +z (정면)
    sideMat, // -z (뒷면)
  ]

  const geometry = new THREE.BoxGeometry(width, height, depth)
  const postitMesh = new THREE.Mesh(geometry, materials)
  group.add(postitMesh)

  // 테이프 Plane 설정
  const tapeWidth = width * 0.5
  const tapeHeight = height * 0.22

  const tapeTexture = createTapeTexture()
  const tapeMaterial = new THREE.MeshBasicMaterial({
    map: tapeTexture,
    transparent: true, // 배경이 투명한 텍스처라서 필요
  })

  const tapeGeometry = new THREE.PlaneGeometry(tapeWidth, tapeHeight)
  const tapeMesh = new THREE.Mesh(tapeGeometry, tapeMaterial)

  // 포스트잇 상단을 덮도록 위치 조정
  const overlapRate = 0.5
  const tapeY = height / 2 + tapeHeight / 2 - tapeHeight * overlapRate
  const tapeZ = depth / 2 + 0.01 // 포스트잇 앞면보다 살짝 앞으로 빼기

  tapeMesh.position.set(0, tapeY, tapeZ)

  group.add(tapeMesh)

  return group
}

//  오브젝트 컴포넌트
//  - 외부에서 title / subtitle / badgeText 만 넘겨주면
//    완성된 포스트잇 Group 을 primitive 로 렌더링.
//  - useFrame 으로 살짝 떠 있는 모션 추가.
export type PostitMeshProps = {
  title: string
  subtitle?: string
  badgeText?: string
  floatSpeed?: number
}

export default function PostitMesh({
  title,
  subtitle,
  badgeText,
  floatSpeed = 0.6,
}: PostitMeshProps) {
  // title / subtitle / badgeText 가 바뀔 때만 메쉬 새로 생성
  const mesh = useMemo(
    () => createPostitMesh(title, subtitle, badgeText),
    [title, subtitle, badgeText]
  )

  // 그룹 전체에 애니메이션을 걸기 위한 ref
  const ref = useRef<THREE.Group>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * floatSpeed
    const g = ref.current
    if (!g) return

    // 위아래로 둥실 떠다니는 모션
    g.position.y = Math.sin(t) * 0.25

    // 약간씩 기울어지는 회전값
    g.rotation.z = Math.sin(t * 1.8) * 0.04
    g.rotation.x = Math.sin(t * 1.4) * 0.03
    g.rotation.y = Math.sin(t * 1.2) * 0.02
  })

  return (
    <group ref={ref} scale={0.4}>
      {/* createPostitMesh 로 만든 THREE.Group 을 그대로 넣는다 */}
      <primitive object={mesh} />
    </group>
  )
}
