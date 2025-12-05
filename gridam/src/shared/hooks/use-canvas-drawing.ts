'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type NPoint = { x: number; y: number } // 0~1
type Stroke = { mode: 'draw' | 'erase'; color: string; size: number; points: NPoint[] }

export function useCanvasDrawing(initialImage?: string | null) {
  // canvas / context / 드로잉 상태
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const isDrawingRef = useRef(false)
  // 리사이즈/재렌더를 위해 스트로크를 저장
  const strokesRef = useRef<Stroke[]>([])
  // 수정 시 기존 이미지를 배경으로 깔기 위한 ref
  const baseImgRef = useRef<HTMLImageElement | null>(null)
  const baseImgReadyRef = useRef(false)
 // history 각 스냅샷 시점의 strokes 길이
  const strokeCountsRef = useRef<number[]>([])

  // UI 상태
  const [canvasImage, setCanvasImage] = useState<string | null>(null)
  const [color, setColor] = useState('#111827')
  const [isEraser, setIsEraser] = useState(false)
  const [size, setSize] = useState(10)
  // 스냅샷 기반 히스토리
  const [history, setHistory] = useState<ImageData[]>([])
  const maxHistory = 50

  // size 변경 시 현재 context 선 두께 반영
  useEffect(() => {
    const ctx = ctxRef.current
    if (!ctx) return
    ctx.lineWidth = size
  }, [size])

  const toggleEraser = () => setIsEraser((v) => !v)

  // 현재 캔버스를 이미지로 저장 -> 추후 미리보기 기능 제공?
  const saveCanvasImage = useCallback(() => {
    const canvas = canvasRef.current
    if (canvas) setCanvasImage(canvas.toDataURL('image/png'))
  }, [])

  // 히스토리 snapshot 저장
  const pushSnapshot = useCallback((snap: ImageData) => {
    strokeCountsRef.current.push(strokesRef.current.length)
    if (strokeCountsRef.current.length > maxHistory) strokeCountsRef.current.shift()

    setHistory((prev) => {
      const next = [...prev, snap]
      if (next.length > maxHistory) next.shift()
      return next
    })
  }, [])

   // 기존 이미지와 모든 스트로크를 현재 캔버스 크기에 맞게 재렌더
  const redrawAll = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) return
    // 해상도 세팅
    const dpr = window.devicePixelRatio || 1
    const cssW = canvas.width / dpr
    const cssH = canvas.height / dpr
    // clear는 픽셀 좌표계(1:1)에서 처리
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 다시 CSS 픽셀 좌표계로 복귀
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    // 기존 이미지를 먼저 그려 배경으로 사용
    if (baseImgRef.current && baseImgReadyRef.current) {
      ctx.drawImage(baseImgRef.current, 0, 0, cssW, cssH)
    }
    // 저장된 스트로크를 순서대로 재생
    for (const s of strokesRef.current) {
      if (s.points.length < 1) continue
      ctx.save()
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = s.size
      if (s.mode === 'erase') {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.strokeStyle = 'rgba(0,0,0,1)'
      } else {
        ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = s.color
      }
      // 정규화 좌표 -> 현재 캔버스 CSS 크기 좌표로 환산
      ctx.beginPath()
      ctx.moveTo(s.points[0].x * cssW, s.points[0].y * cssH)
      for (let i = 1; i < s.points.length; i++) {
        ctx.lineTo(s.points[i].x * cssW, s.points[i].y * cssH)
      }
      ctx.stroke()
      ctx.restore()
    }
  }, [])

  // undo - 마지막 이전 스냅샷으로 복원
  const handleUndo = useCallback(() => {
    // 드로잉 중이면 종료 처리
    isDrawingRef.current = false

    setHistory((prev) => {
      if (prev.length <= 1) return prev
      const next = prev.slice(0, -1)
      strokeCountsRef.current.pop()
      const targetCount = strokeCountsRef.current[strokeCountsRef.current.length - 1] ?? 0
      strokesRef.current = strokesRef.current.slice(0, targetCount)
      redrawAll()
      saveCanvasImage()
      return next
    })
  }, [redrawAll, saveCanvasImage])

  // clear - 캔버스 비우고 히스토리 초기화
  const clearHistory = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) {
      setHistory([])
      strokeCountsRef.current = []
      strokesRef.current = []
      baseImgRef.current = null
      baseImgReadyRef.current = false
      setCanvasImage(null)
      return
    }
    isDrawingRef.current = false
    strokesRef.current = []
    strokeCountsRef.current = [0]
    baseImgRef.current = null
    baseImgReadyRef.current = false
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const snap = ctx.getImageData(0, 0, canvas.width, canvas.height)
    setHistory([snap])
    setCanvasImage(null)
  }, [])

  // 포인터 좌표를 정규화 좌표(0~1)로 변환
  const getNPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) }
  }


  // 그림 그리기 시작
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const ctx = ctxRef.current
      if (!ctx) return

      isDrawingRef.current = true
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)

      const point = getNPoint(e)
      if (!point) return

      const stroke: Stroke = {
        mode: isEraser ? 'erase' : 'draw',
        color: isEraser ? 'rgba(0,0,0,1)' : color,
        size,
        points: [point],
      }
      strokesRef.current.push(stroke)

      redrawAll()
    },
    [color, isEraser, size, redrawAll]
  )

  // 그리는 중
  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current) return
      const porint = getNPoint(e)
      if (!porint) return
      const last = strokesRef.current[strokesRef.current.length - 1]
      if (!last) return
      last.points.push(porint)
      redrawAll()
    },
    [redrawAll]
  )

  // 그리기 종료
  const onPointerUpOrLeave = useCallback(
    (e?: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      const ctx = ctxRef.current
      if (!canvas || !ctx || !isDrawingRef.current) return

      isDrawingRef.current = false
      if (e) (e.target as HTMLElement).releasePointerCapture(e.pointerId)

      ctx.closePath()

      const snap = ctx.getImageData(0, 0, canvas.width, canvas.height)
      pushSnapshot(snap)
      saveCanvasImage()
    },
    [pushSnapshot, saveCanvasImage]
  )

  // setup
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // 해상도 세팅
    const dpr = window.devicePixelRatio || 1
    const cssW = canvas.clientWidth || 600
    const cssH = canvas.clientHeight || 300
    canvas.width = Math.floor(cssW * dpr)
    canvas.height = Math.floor(cssH * dpr)
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    // CSS 좌표계로 그릴 수 있게 transform 적용
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.lineCap = 'round'
    ctx.lineWidth = size
    ctx.globalCompositeOperation = 'source-over'

    ctxRef.current = ctx
  }, [size])

  // 초기 세팅 1번 캔버스 만들기
  useEffect(() => {
    setupCanvas()

    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (canvas && ctx) {
      const snap = ctx.getImageData(0, 0, canvas.width, canvas.height)
      pushSnapshot(snap)
    }
  }, [setupCanvas, pushSnapshot])

  // 리사이즈 - 캔버스 재세팅 후 스트로크 기반으로 다시 렌더
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    const resize = new ResizeObserver(() => {
      if (isDrawingRef.current) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        setupCanvas()
        redrawAll()
      })
    })
    resize.observe(canvas)
    return () => {
      cancelAnimationFrame(raf)
      resize.disconnect()
    }
  }, [setupCanvas, redrawAll])

  // initialImage를 배경 이미지로 로드하고 다시 그리기
  useEffect(() => {
    if (!initialImage) return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      baseImgRef.current = img
      baseImgReadyRef.current = true
      redrawAll()
    }
    img.src = initialImage
  }, [initialImage, redrawAll])

  return {
    canvasRef,
    canvasImage,
    setCanvasImage,

    // 상태
    color,
    isEraser,
    size,
    history,

    // 액션
    setColor,
    toggleEraser,
    setSize,
    handleUndo,
    clearHistory,
    saveCanvasImage,

    // 그림 이벤트
    onPointerDown,
    onPointerMove,
    onPointerUpOrLeave,
  }
}
