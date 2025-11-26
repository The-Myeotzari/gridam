'use client'

import ClientButton from '@/shared/ui/client-button'
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
  color: string
  isEraser: boolean
  setColor: (c: string) => void
  toggleEraser: () => void
  handleUndo: () => void
  clearHistory: () => void
}

export function CanvasToolbar({
  color,
  isEraser,
  setColor,
  toggleEraser,
  handleUndo,
  clearHistory,
}: Props) {
  const [showPalette, setShowPalette] = useState(false)

  const handleColorChange = (c: string) => {
    if (isEraser) toggleEraser()
    setColor(c)
  }

  return (
    <div className="w-full flex items-center justify-between gap-3">
      <div className="relative flex items-center gap-2">
        {/* 모바일 전용 색상 토글 */}
        <ClientButton
          type="button"
          size="icon"
          variant="roundedBasic"
          label={<span className="text-xs">색상</span>}
          onClick={() => setShowPalette((p) => !p)}
          className="sm:hidden"
        />

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
              <ClientButton
                key={c}
                type="button"
                size="icon"
                variant="roundedBasic"
                aria-pressed={active}
                isActive={active}
                label={
                  <span className="block w-5 h-5 rounded-full" style={{ backgroundColor: c }} />
                }
                onClick={() => {
                  handleColorChange(c)
                  setShowPalette(false)
                }}
              />
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ClientButton
          type="button"
          label={isEraser ? '✏️ 펜으로' : '🧽 지우개'}
          onClick={toggleEraser}
        />
        <ClientButton type="button" label={<Undo2 size={18} />} onClick={handleUndo} />
        <ClientButton type="button" label={<Trash2 size={18} />} onClick={clearHistory} />
      </div>
    </div>
  )
}
