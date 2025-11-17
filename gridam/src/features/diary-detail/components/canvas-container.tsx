'use client'

import { useCanvasDrawing } from '@/features/diary-detail/hooks/use-canvas-drawing'
import { useSetCanvas } from '@/features/diary-detail/store/canvas-store'
import { memo, useCallback, useEffect } from 'react'
import { CanvasToolbar } from './canvas-toolbar'
import { CanvasView } from './canvas-view'

function CanvasContainer({ initialImage }: { initialImage?: string | null }) {
  const { canvasRef, handleUndo, clearCanvas, onPointerDown, onPointerMove, onPointerUpOrLeave } =
    useCanvasDrawing()

  const setCanvas = useSetCanvas()

  useEffect(() => {
    if (!initialImage) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = initialImage

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      setCanvas(initialImage)
    }
  }, [initialImage, canvasRef, setCanvas])

  const saveImage = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL('image/png')
    setCanvas(dataUrl)
  }, [canvasRef, setCanvas])

  return (
    <section className="flex flex-col items-center gap-4 p-5 border-b">
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
