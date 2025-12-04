'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export function useCanvasDrawing(initialImage?: string | null) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const isDrawingRef = useRef(false)

  // 상태
  const [canvasImage, setCanvasImage] = useState<string | null>(null)
  const [color, setColor] = useState('#111827')
  const [isEraser, setIsEraser] = useState(false)
  const [size, setSize] = useState(10)
  const [history, setHistory] = useState<ImageData[]>([])
  const maxHistory = 50

  useEffect(() => {
    const ctx = ctxRef.current
    if (!ctx) return
    ctx.lineWidth = size
  }, [size])

  const toggleEraser = () => setIsEraser((v) => !v)

  // 저장
  const saveCanvasImage = useCallback(() => {
    const canvas = canvasRef.current
    if (canvas) setCanvasImage(canvas.toDataURL('image/png'))
  }, [])

  // snapshot 저장
  const pushSnapshot = useCallback((snap: ImageData) => {
    setHistory((prev) => {
      const next = [...prev, snap]
      if (next.length > maxHistory) next.shift()
      return next
    })
  }, [])

  // undo
  const handleUndo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length <= 1) return prev

      const next = prev.slice(0, -1)
      const last = next[next.length - 1]

      const ctx = ctxRef.current
      if (ctx && last) ctx.putImageData(last, 0, 0)

      saveCanvasImage()
      return next
    })
  }, [saveCanvasImage])

  // clear
  const clearHistory = () => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    // 준비 안된 상태 처리
    if (!canvas || !ctx) {
      setHistory([])
      setCanvasImage(null)
      return
    }
    // 초기화랑 동일한 로직 진행
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const emptySnap = ctx.getImageData(0, 0, canvas.width, canvas.height)
    setHistory([emptySnap])
    setCanvasImage(null)
  }

  // css 색상 해석
  const resolveColor = useCallback((input: string): string => {
    if (!input.startsWith('var(')) return input
    const name = input.slice(4, -1).trim()
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#000'
  }, [])

  // 그림 그리기
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const ctx = ctxRef.current
      if (!ctx) return

      isDrawingRef.current = true
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)

      ctx.lineWidth = size

      if (isEraser) {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.strokeStyle = 'rgba(0,0,0,1)'
      } else {
        ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = resolveColor(color)
      }

      const { offsetX, offsetY } = e.nativeEvent
      ctx.beginPath()
      ctx.moveTo(offsetX, offsetY)
    },
    [color, isEraser, resolveColor, size]
  )

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = ctxRef.current
    if (!ctx || !isDrawingRef.current) return

    const { offsetX, offsetY } = e.nativeEvent
    ctx.lineTo(offsetX, offsetY)
    ctx.stroke()
  }, [])

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

    const dpr = window.devicePixelRatio || 1
    const cssW = canvas.clientWidth || 600
    const cssH = canvas.clientHeight || 300

    canvas.width = Math.floor(cssW * dpr)
    canvas.height = Math.floor(cssH * dpr)

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

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

  // 캔버스 만들어진 이후에 세팅 진행
  useEffect(() => {
    if (!initialImage) return
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = initialImage

    img.onload = () => {
      const canvas = canvasRef.current
      const ctx = ctxRef.current
      if (!canvas || !ctx) return

      const cssW = canvas.clientWidth
      const cssH = canvas.clientHeight

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, cssW, cssH)
    }
  }, [initialImage])

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
