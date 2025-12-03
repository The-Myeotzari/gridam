'use client'

import ClientButton from '@/shared/ui/client-button'
import { Pipette, Trash2, Undo2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ColorPicker, IColor, useColor } from 'react-color-palette'

function resolveCssVar(input: string) {
  const m = input.match(/^var\((--[^)]+)\)$/)
  if (!m) return input
  if (typeof window === 'undefined') return '#000000'
  const raw = getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim()
  return raw || '#000000'
}

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
  const [showPicker, setShowPicker] = useState(false)
  const resolved = useMemo(() => resolveCssVar(color), [color])
  const [pickerColor, setPickerColor] = useColor(resolved)

  const handlePickerChange = (next: IColor) => {
    if (isEraser) toggleEraser()
    setPickerColor(next)
    setColor(next.hex)
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
          <ClientButton
            type="button"
            size="icon"
            variant="roundedBasic"
            label={<Pipette size={18} />}
            aria-pressed={showPicker}
            isActive={showPicker}
            onClick={() => setShowPicker((v) => !v)}
          />
        </div>
        {showPicker && (
          <ColorPicker
            color={pickerColor}
            onChange={handlePickerChange}
            hideAlpha
            hideInput={['rgb', 'hsv']}
            height={180}
          />
        )}
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
