'use client'

import { CanvasToolbar } from '@/components/ui/canvas-toolbar'
import { CanvasView } from '@/components/ui/canvas-view'
import { useCanvasDrawing } from '@/hooks/useCanvasDrawing'

export default function CanvasContainer() {
  const {
    canvasRef,
    isEraser,
    setColor,
    setIsEraser,
    toggleEraser,
    handleUndo,
    clearCanvas,
    onPointerDown,
    onPointerMove,
    onPointerUpOrLeave,
  } = useCanvasDrawing()

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* 툴바 (간단 버전) */}
      <CanvasToolbar
        isEraser={isEraser}
        setIsEraser={setIsEraser}
        setColor={setColor}
        toggleEraser={toggleEraser}
        handleUndo={handleUndo}
        clearCanvas={clearCanvas}
      />
      {/* 순수 뷰 컴포넌트 */}
      <CanvasView
        canvasRef={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUpOrLeave={onPointerUpOrLeave}
        width={600}
        height={300}
      />
    </div>
  )
}
