'use client'

import { useCanvasDrawing } from '@/hooks/useCanvasDrawing'
import { CanvasToolbar } from './canvas-toolbar'
import { CanvasView } from './canvas-view'

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
