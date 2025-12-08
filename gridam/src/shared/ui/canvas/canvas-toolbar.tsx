'use client'

import { useCanvasToolbar } from '@/shared/hooks/use-canvas-toolbar'
import ClientButton from '@/shared/ui/client-button'
import ClientInput from '@/shared/ui/input.client'
import cn from '@/shared/utils/cn'
import { Eraser, Pencil, Pipette, Trash2, Undo2 } from 'lucide-react'
import { ColorPicker } from 'react-color-palette'

const BASE_COLORS = ['#111827', '#EF4444', '#22C55E', '#3B82F6', '#F59E0B'] as const
const MIN_SIZE = 1
const MAX_SIZE = 20

type Props = {
  color: string
  isEraser: boolean
  size: number
  setColor: (c: string) => void
  toggleEraser: () => void
  setSize: (value: number) => void
  handleUndo: () => void
  clearHistory: () => void
}

export function CanvasToolbar(props: Props) {
  const { color, isEraser, size, setColor, toggleEraser, setSize, handleUndo, clearHistory } = props
  const {
    showPalette,
    showPicker,
    pickerAreaRef,
    resolved,
    pickerColor,
    currentHex,
    togglePalette,
    togglePicker,
    commit,
    commitHex,
  } = useCanvasToolbar({ color, isEraser, setColor, toggleEraser })

  return (
    <div className="w-full flex items-center justify-between gap-3">
      <div className="relative flex items-center gap-2">
        {/* 모바일 전용 색상 토글 */}
        <ClientButton
          type="button"
          size="icon"
          variant="roundedBasic"
          label={<span className="text-xs">색상</span>}
          onClick={togglePalette}
          className="sm:hidden"
          aria-expanded={showPalette}
        />
        {/* 팔레트 영역(모바일: 토글 / 데스크탑: 항상 표시) */}
        <div
          className={cn(
            showPalette ? 'flex' : 'hidden',
            'absolute bottom-full mb-2 left-0 z-20 rounded-xl bg-white px-2 py-2 shadow-md',
            'sm:static sm:mb-0 sm:bg-transparent sm:shadow-none sm:flex items-center gap-2'
          )}
        >
          {/* 기본 5색 */}
          <div className="flex items-center gap-2">
            {BASE_COLORS.map((c) => {
              const active = currentHex.toLowerCase() === c.toLowerCase()
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => commitHex(c)}
                  className={cn(
                    'h-7 w-7 rounded-full border shadow-sm',
                    active ? 'border-black ring-2 ring-black/40' : 'border-black/10'
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={`기본 색상 ${c}`}
                  title={c}
                />
              )
            })}
          </div>

          <div ref={pickerAreaRef} className="relative">
            <ClientButton
              type="button"
              size="icon"
              variant="roundedBasic"
              label={<Pipette size={18} />}
              aria-pressed={showPicker}
              isActive={showPicker}
              onClick={togglePicker}
            />

            {showPicker && (
              <div className="absolute top-full mt-2 z-50 right-7 sm:right-0">
                <ColorPicker
                  color={pickerColor}
                  onChange={commit}
                  hideAlpha
                  hideInput={['rgb', 'hsv']}
                  height={180}
                />
              </div>
            )}
          </div>
        </div>

        {/* 선택 색상 출력(1개) */}
        <div className="flex items-center gap-2">
          <span
            className="h-7 w-7 rounded-full border border-black/10 shadow-sm"
            style={{ backgroundColor: resolved }}
            aria-label={`현재 색상 ${resolved}`}
            title={resolved}
          />
          <span className="hidden sm:inline text-xs text-gray-600 tabular-nums">{resolved}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ClientInput
          type="number"
          value={size}
          autoComplete="off"
          inputMode="numeric"
          pattern="[0-20]*"
          step={1}
          max={MAX_SIZE}
          min={MIN_SIZE}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-15"
        />
        <ClientButton
          type="button"
          label={isEraser ? <Eraser /> : <Pencil />}
          onClick={toggleEraser}
        />
        <ClientButton type="button" label={<Undo2 size={18} />} onClick={handleUndo} />
        <ClientButton type="button" label={<Trash2 size={18} />} onClick={clearHistory} />
      </div>
    </div>
  )
}
