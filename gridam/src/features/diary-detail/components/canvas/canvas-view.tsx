'use client'

import cn from '@/shared/utils/cn'
import React from 'react'

type Props = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  onPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => void
  onPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => void
  onPointerUpOrLeave: (e: React.PointerEvent<HTMLCanvasElement>) => void
  className?: string
  height?: number
}

export function CanvasView({
  canvasRef,
  onPointerDown,
  onPointerMove,
  onPointerUpOrLeave,
  className,
  height = 45,
}: Props) {
  return (
    <div className="w-full border border-gray-200 rounded-xl bg-white shadow-sm">
      <canvas
        ref={canvasRef}
        className={cn('block w-full rounded-xl cursor-crosshair', className)}
        style={{ height: `${height}vh` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUpOrLeave}
        onPointerLeave={onPointerUpOrLeave}
      />
    </div>
  )
}
