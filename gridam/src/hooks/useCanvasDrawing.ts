'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Snapshot = ImageData
type Options = {
  historyLimit?: number
}

function resolveColor(input: string): string {
  if (!input.startsWith('var(')) return input
  const name = input.slice(4, -1).trim()
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#000'
}

export function useCanvasDrawing({ historyLimit = 50 }: Options = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const isDrawingRef = useRef(false)
  const historyRef = useRef<Snapshot[]>([])

  const [color, setColor] = useState('var(--color-canva-red)')
  const [isEraser, setIsEraser] = useState(false)

  const pushSnapshot = useCallback(() => {
    const c = canvasRef.current
    const ctx = ctxRef.current
    if (!c || !ctx) return
    const snap = ctx.getImageData(0, 0, c.width, c.height)
    const next = [...historyRef.current, snap]
    if (next.length > historyLimit) next.shift()
    historyRef.current = next
  }, [historyLimit])

  const clearCanvas = useCallback(() => {
    const c = canvasRef.current
    const ctx = ctxRef.current
    if (!c || !ctx) return
    ctx.clearRect(0, 0, c.width, c.height)
    historyRef.current = []
    pushSnapshot()
  }, [pushSnapshot])

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const ctx = ctxRef.current
      if (!ctx) return
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      isDrawingRef.current = true

      if (isEraser) {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.strokeStyle = 'rgba(0,0,0,1)'
        ctx.lineWidth = 15
      } else {
        ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = resolveColor(color)
        ctx.lineWidth = 4
      }

      const { offsetX, offsetY } = e.nativeEvent
      ctx.beginPath()
      ctx.moveTo(offsetX, offsetY)
    },
    [color, isEraser, resolveColor]
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
      const ctx = ctxRef.current
      if (!ctx || !isDrawingRef.current) return
      if (e) (e.target as HTMLElement).releasePointerCapture(e.pointerId)
      isDrawingRef.current = false
      ctx.closePath()
      pushSnapshot()
    },
    [pushSnapshot]
  )

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const cssW = canvas.clientWidth || 600
    const cssH = canvas.clientHeight || 300

    canvas.width = Math.floor(cssW * dpr)
    canvas.height = Math.floor(cssH * dpr)

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.lineCap = 'round'
    ctx.lineWidth = 4
    ctx.globalCompositeOperation = 'source-over'

    ctxRef.current = ctx
  }, [])

  const handleUndo = useCallback(() => {
    const c = canvasRef.current
    const ctx = ctxRef.current
    if (!c || !ctx) return
    const stack = historyRef.current
    if (stack.length <= 1) return
    stack.pop()
    const last = stack[stack.length - 1]
    ctx.putImageData(last, 0, 0)
  }, [])

  useEffect(() => {
    setupCanvas()
    pushSnapshot()

    const onResize = () => {
      const c = canvasRef.current
      const ctx = ctxRef.current
      if (!c || !ctx) return

      const prev = ctx.getImageData(0, 0, c.width, c.height)

      setupCanvas()
      try {
        ctxRef.current?.putImageData(prev, 0, 0)
      } catch {
        pushSnapshot()
      }
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return {
    // refs
    canvasRef,
    // state
    isEraser,
    color,
    // actions
    setColor,
    setIsEraser,
    toggleEraser: () => setIsEraser((v) => !v),
    handleUndo,
    clearCanvas,
    // event handlers
    onPointerDown,
    onPointerMove,
    onPointerUpOrLeave,
  }
}
