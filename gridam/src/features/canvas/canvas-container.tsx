'use client'

import { CanvasToolbar } from '@/features/canvas/canvas-toolbar'
import { CanvasView } from '@/features/canvas/canvas-view'
import { useCanvasDrawing } from '@/features/canvas/use-canvas-drawing'
import { memo, useEffect } from 'react'

function CanvasContainer({
  initialImage,
  onChange,
}: {
  initialImage?: string | null
  onChange: (img: string | null) => void
}) {
  const {
    canvasRef,
    canvasImage,

    color,
    setColor,
    isEraser,
    toggleEraser,
    handleUndo,
    clearHistory,

    onPointerDown,
    onPointerMove,
    onPointerUpOrLeave,
  } = useCanvasDrawing(initialImage)

  useEffect(() => {
    onChange(canvasImage)
  }, [canvasImage, onChange])

  return (
    <section className="flex flex-col items-center gap-4 p-5 border-b">
      <CanvasToolbar
        color={color}
        setColor={setColor}
        isEraser={isEraser}
        toggleEraser={toggleEraser}
        handleUndo={handleUndo}
        clearHistory={clearHistory}
      />

      <CanvasView
        canvasRef={canvasRef}
        height={45}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUpOrLeave={onPointerUpOrLeave}
      />
    </section>
  )
}

export default memo(CanvasContainer)
