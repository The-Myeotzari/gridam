'use client'

import { Trash2, Undo2 } from 'lucide-react'
import Button from '../ui/button'

type Props = {
  isEraser: boolean
  setIsEraser: (value: boolean) => void
  setColor: (c: string) => void
  toggleEraser: () => void
  handleUndo: () => void
  clearCanvas: () => void
}

const palette = [
  'var(--color-canva-red)',
  'var(--color-canva-blue)',
  'var(--color-canva-green)',
  'var(--color-canva-yellow)',
  'var(--color-canva-black)',
]

export function CanvasToolbar({
  isEraser,
  setIsEraser,
  setColor,
  toggleEraser,
  handleUndo,
  clearCanvas,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      {palette.map((c) => (
        <button
          type="button"
          aria-label={`pick ${c}`}
          onClick={() => {
            setIsEraser(false)
            setColor(c)
          }}
          className="w-6 h-6 rounded-full border border-black/5 shadow-sm"
          style={{ backgroundColor: c }}
        />
      ))}

      <Button onClick={toggleEraser} label={isEraser ? '✏️ 펜으로' : '🧽 지우개'} />
      <Button onClick={handleUndo} label={<Undo2 size={18} />} />
      <Button onClick={clearCanvas} label={<Trash2 size={18} />} />
    </div>
  )
}
