'use client'

import React from 'react'

type Props = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  onPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => void
  onPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => void
  onPointerUpOrLeave: (e: React.PointerEvent<HTMLCanvasElement>) => void
  className?: string
  width?: number
  height?: number
}

export function CanvasView({
  canvasRef,
  onPointerDown,
  onPointerMove,
  onPointerUpOrLeave,
  className,
  width = 600,
  height = 300,
}: Props) {
  if (!canvasRef) return
  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
      <canvas
        ref={canvasRef}
        className={className ?? 'cursor-crosshair rounded-xl'}
        style={{ width, height }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUpOrLeave}
        onPointerLeave={onPointerUpOrLeave}
      />
    </div>
  )
}
