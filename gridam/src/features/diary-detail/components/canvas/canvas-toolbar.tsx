'use client'

import Button from '@/components/ui/button'
import { useCanvasStore } from '@/features/diary-detail/store/canvas-store'
import { Trash2, Undo2 } from 'lucide-react'
import { useState } from 'react'

const palette = [
  'var(--color-canva-red)',
  'var(--color-canva-blue)',
  'var(--color-canva-green)',
  'var(--color-canva-yellow)',
  'var(--color-canva-black)',
]

type Props = {
  handleUndo: () => void
  clearCanvas: () => void
}

export function CanvasToolbar({ handleUndo, clearCanvas }: Props) {
  const { color, isEraser, toggleEraser, setColor } = useCanvasStore()

  const [showPalette, setShowPalette] = useState(false)

  const handleColorChange = (c: string) => {
    if (isEraser) toggleEraser()
    setColor(c)
  }

  return (
    <div className="w-full flex items-center justify-between gap-3">
      <div className="relative flex items-center gap-2">
        {/* 모바일 전용 색상 토글 버튼 */}
        <span onClick={() => setShowPalette((prev) => !prev)} className="sm:hidden">
          <Button
            type="button"
            size="icon"
            variant="roundedBasic"
            label={<span className="text-xs">색상</span>}
          />
        </span>

        <div
          className={`
            ${showPalette ? 'flex' : 'hidden'}
            absolute bottom-full mb-2 left-0 z-20 rounded-xl bg-white px-2 py-1 shadow-md
            sm:static sm:mb-0 sm:bg-transparent sm:shadow-none sm:flex
            items-center gap-2
          `}
        >
          {palette.map((c) => {
            const active = color === c
            return (
              <span
                key={c}
                onClick={() => {
                  handleColorChange(c)
                  setShowPalette(false)
                }}
              >
                <Button
                  type="button"
                  size="icon"
                  variant="roundedBasic"
                  aria-pressed={active}
                  label={
                    <span className="block w-5 h-5 rounded-full" style={{ backgroundColor: c }} />
                  }
                  isActive={active}
                />
              </span>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span onClick={toggleEraser}>
          <Button type="button" label={isEraser ? '✏️ 펜으로' : '🧽 지우개'} />
        </span>
        <span onClick={handleUndo}>
          <Button type="button" label={<Undo2 size={18} />} />
        </span>
        <span onClick={clearCanvas}>
          <Button type="button" label={<Trash2 size={18} />} />
        </span>
      </div>
    </div>
  )
}
