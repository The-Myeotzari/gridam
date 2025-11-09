'use client'

import Button from '@/components/ui/button'
import { useCanvasStore } from '@/features/write/stores/useCanvas'
import { Trash2, Undo2 } from 'lucide-react'

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

  return (
    <div className="w-full flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {palette.map((c) => {
          const active = color === c
          return (
            <Button
              key={c}
              type="button"
              size="icon"
              variant="roundedBasic"
              onClick={() => {
                if (isEraser) toggleEraser()
                setColor(c)
              }}
              aria-pressed={active}
              label={<span className="block w-5 h-5 rounded-full" style={{ backgroundColor: c }} />}
              isActive={active}
            />
          )
        })}
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" onClick={toggleEraser} label={isEraser ? '✏️ 펜으로' : '🧽 지우개'} />
        <Button type="button" onClick={handleUndo} label={<Undo2 size={18} />} />
        <Button type="button" onClick={clearCanvas} label={<Trash2 size={18} />} />
      </div>
    </div>
  )
}
