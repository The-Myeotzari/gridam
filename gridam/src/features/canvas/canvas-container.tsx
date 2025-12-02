'use client'

import { CanvasToolbar } from '@/features/canvas/canvas-toolbar'
import { CanvasView } from '@/features/canvas/canvas-view'
import { useCanvasDrawing } from '@/features/canvas/use-canvas-drawing'
import { memo } from 'react'

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

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    onPointerUpOrLeave(e)

    if (canvasRef.current) {
      onChange(canvasImage)
    }
  }

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
        onPointerUpOrLeave={handlePointerUp}
      />
    </section>
  )
}

export default memo(CanvasContainer)
