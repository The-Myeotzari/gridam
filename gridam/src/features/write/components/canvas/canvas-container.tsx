'use client'

import { CanvasToolbar } from '@/features/write/components/canvas/canvas-toolbar'
import { CanvasView } from '@/features/write/components/canvas/canvas-view'
import { useCanvasDrawing } from '@/features/write/hooks/use-canvas-drawing'
import { useEffect } from 'react'

type Props = {
  onReady?: (getImage: () => string | null) => void
}

export default function CanvasContainer({ onReady }: Props) {
  const {
    canvasRef,
    handleUndo,
    clearCanvas,
    onPointerDown,
    onPointerMove,
    onPointerUpOrLeave,
    getCanvasImage,
  } = useCanvasDrawing()

  useEffect(() => {
    if (onReady) onReady(getCanvasImage)
  }, [onReady, getCanvasImage])

  return (
    <section
      className="flex flex-col items-center gap-4 p-5 border-b"
      style={{ borderColor: 'black' }}
    >
      <CanvasToolbar handleUndo={handleUndo} clearCanvas={clearCanvas} />
      <CanvasView
        canvasRef={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUpOrLeave={onPointerUpOrLeave}
        height={45}
      />
    </section>
  )
}
