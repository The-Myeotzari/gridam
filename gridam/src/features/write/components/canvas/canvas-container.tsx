'use client'

import { CanvasToolbar } from '@/features/write/components/canvas/canvas-toolbar'
import { CanvasView } from '@/features/write/components/canvas/canvas-view'
import { useCanvasDrawing } from '@/features/write/hooks/useCanvasDrawing'

export default function CanvasContainer() {
  const { canvasRef, handleUndo, clearCanvas, onPointerDown, onPointerMove, onPointerUpOrLeave } =
    useCanvasDrawing()

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <CanvasToolbar handleUndo={handleUndo} clearCanvas={clearCanvas} />
      <CanvasView
        canvasRef={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUpOrLeave={onPointerUpOrLeave}
        height={600}
      />
    </div>
  )
}
