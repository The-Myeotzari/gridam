'use client'

import { CanvasToolbar } from '@/features/write/components/canvas/canvas-toolbar'
import { CanvasView } from '@/features/write/components/canvas/canvas-view'
import { useCanvasDrawing } from '@/features/write/hooks/use-canvas-drawing'
import { useSetCanvas } from '@/features/write/store/write-store'
import { memo, useEffect } from 'react'

function CanvasContainer() {
  const { canvasRef, handleUndo, clearCanvas, onPointerDown, onPointerMove, onPointerUpOrLeave } =
    useCanvasDrawing()

  const setCanvas = useSetCanvas()

  const saveImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    setCanvas(dataUrl)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const observer = new MutationObserver(saveImage)
    observer.observe(canvas, { attributes: true, childList: true, subtree: true })

    saveImage()

    return () => observer.disconnect()
  }, [canvasRef])

  return (
    <section
      className="flex flex-col items-center gap-4 p-5 border-b"
      style={{ borderColor: 'black' }}
    >
      <CanvasToolbar handleUndo={handleUndo} clearCanvas={clearCanvas} />

      <CanvasView
        canvasRef={canvasRef}
        onPointerDown={(e) => {
          onPointerDown(e)
          saveImage()
        }}
        onPointerMove={(e) => {
          onPointerMove(e)
          saveImage()
        }}
        onPointerUpOrLeave={(e) => {
          onPointerUpOrLeave(e)
          saveImage()
        }}
        height={45}
      />
    </section>
  )
}

export default memo(CanvasContainer)
