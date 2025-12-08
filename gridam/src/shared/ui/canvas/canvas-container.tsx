'use client'

import { useCanvasDrawing } from '@/shared/hooks/use-canvas-drawing'
import { CanvasToolbar } from '@/shared/ui/canvas/canvas-toolbar'
import { CanvasView } from '@/shared/ui/canvas/canvas-view'
import { useCanvasStore } from '@/store/canvas-store'
import { memo } from 'react'

function CanvasContainer({ initialImage }: { initialImage?: string | null }) {
  const setImage = useCanvasStore((s) => s.setImage)
  const {
    canvasRef,

    color,
    setColor,
    isEraser,
    toggleEraser,
    size,
    setSize,
    handleUndo,
    clearHistory,

    onPointerDown,
    onPointerMove,
    onPointerUpOrLeave,
  } = useCanvasDrawing(initialImage)

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    onPointerUpOrLeave(e)

    const canvas = canvasRef.current
    if (canvas) {
      setImage(canvas.toDataURL('image/png'))
    }
  }

  return (
    <section className="flex flex-col items-center gap-4 p-5 border-b">
      <CanvasToolbar
        color={color}
        setColor={setColor}
        isEraser={isEraser}
        toggleEraser={toggleEraser}
        size={size}
        setSize={setSize}
        handleUndo={handleUndo}
        clearHistory={clearHistory}
      />

      <CanvasView
        canvasRef={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUpOrLeave={handlePointerUp}
      />
    </section>
  )
}

export default memo(CanvasContainer)
