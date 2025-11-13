'use client'

import { useCanvasStore, useSetCanvas } from '@/features/write/store/canvas-store'
import { useCallback, useEffect, useRef } from 'react'

export function useCanvasDrawing() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const isDrawingRef = useRef(false)

  const { color, isEraser, toggleEraser, setColor, pushSnapshot, undo, clearHistory } =
    useCanvasStore()

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
      const c = canvasRef.current
      const ctx = ctxRef.current
      if (!c || !ctx || !isDrawingRef.current) return
      if (e) (e.target as HTMLElement).releasePointerCapture(e.pointerId)
      isDrawingRef.current = false
      ctx.closePath()
      const snap = ctx.getImageData(0, 0, c.width, c.height)
      pushSnapshot(snap)
    },
    [pushSnapshot]
  )

  // undo/clear
  const handleUndo = useCallback(() => {
    const ctx = ctxRef.current
    const c = canvasRef.current
    if (!c || !ctx) return
    const last = undo()
    if (last) ctx.putImageData(last, 0, 0)
  }, [undo])

  const clearCanvas = useCallback(() => {
    const c = canvasRef.current
    const ctx = ctxRef.current
    if (!c || !ctx) return
    ctx.clearRect(0, 0, c.width, c.height)
    clearHistory()
    const blank = ctx.getImageData(0, 0, c.width, c.height)
    pushSnapshot(blank)
  }, [clearHistory, pushSnapshot])

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

  useEffect(() => {
    setupCanvas()
    {
      const c = canvasRef.current
      const ctx = ctxRef.current
      if (c && ctx) {
        const snap = ctx.getImageData(0, 0, c.width, c.height)
        pushSnapshot(snap)
      }
    }

    const onResize = () => {
      const c = canvasRef.current
      const ctx = ctxRef.current
      if (!c || !ctx) return
      const prev = ctx.getImageData(0, 0, c.width, c.height)
      setupCanvas()
      try {
        ctxRef.current?.putImageData(prev, 0, 0)
      } catch {
        const blank = ctx.getImageData(0, 0, c.width, c.height)
        pushSnapshot(blank)
      }
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [pushSnapshot, setupCanvas])

  const setCanvas = useSetCanvas()
  const getCanvasImage = () => {
    const canvas = canvasRef.current
    const canvasImage = canvas ? canvas.toDataURL('image/png') : null
    setCanvas(canvasImage)
  }

  return {
    canvasRef,
    color,
    isEraser,
    setColor,
    toggleEraser,
    handleUndo,
    clearCanvas,
    onPointerDown,
    onPointerMove,
    onPointerUpOrLeave,
    getCanvasImage,
  }
}
