'use client'

import { CanvasToolbar } from '@/features/write/components/canvas-toolbar'
import { CanvasView } from '@/features/write/components/canvas-view'
import { useCanvasDrawing } from '@/features/write/hooks/use-canvas-drawing'
import { useSetCanvas } from '@/features/write/store/canvas-store'
import { memo, useCallback } from 'react'

function CanvasContainer() {
  const { canvasRef, handleUndo, clearCanvas, onPointerDown, onPointerMove, onPointerUpOrLeave } =
    useCanvasDrawing()

  const setCanvas = useSetCanvas()

  const saveImage = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL('image/png')
    setCanvas(dataUrl)
  }, [canvasRef, setCanvas])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      onPointerDown(e)
      saveImage()
    },
    [onPointerDown, saveImage]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      onPointerMove(e)
      saveImage()
    },
    [onPointerMove, saveImage]
  )

  const handlePointerUpOrLeave = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      onPointerUpOrLeave(e)
      saveImage()
    },
    [onPointerUpOrLeave, saveImage]
  )

  return (
    <section
      className="flex flex-col items-center gap-4 p-5 border-b"
      style={{ borderColor: 'black' }}
    >
      <CanvasToolbar handleUndo={handleUndo} clearCanvas={clearCanvas} />

      <CanvasView
        canvasRef={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUpOrLeave={handlePointerUpOrLeave}
        height={45}
      />
    </section>
  )
}

export default memo(CanvasContainer)
