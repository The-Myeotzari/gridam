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
}: Props) {
  const handleTouchMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    onPointerMove(e)
  }

  return (
    <div className="w-full aspect-video border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
      <canvas
        ref={canvasRef}
        className={cn('block w-full h-full rounded-xl cursor-crosshair touch-none', className)}
        style={{ touchAction: 'none' }}
        onPointerDown={onPointerDown}
        onPointerMove={handleTouchMove}
        onPointerUp={onPointerUpOrLeave}
        onPointerLeave={onPointerUpOrLeave}
      />
    </div>
  )
}
