'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ColorService, IColor, useColor } from 'react-color-palette'

function resolveCssVar(input: string) {
  const m = input.match(/^var\((--[^)]+)\)$/)
  if (!m) return input
  if (typeof window === 'undefined') return '#000000'
  const raw = getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim()
  return raw || '#000000'
}

function useOnClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  enabled: boolean,
  onOutside: () => void
) {
  useEffect(() => {
    if (!enabled) return

    const handler = (e: MouseEvent | TouchEvent) => {
      const el = ref.current
      if (!el) return
      if (!el.contains(e.target as Node)) onOutside()
    }

    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler, { passive: true })

    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [enabled, onOutside, ref])
}

type UseCanvasToolbarArgs = {
  color: string
  isEraser: boolean
  setColor: (c: string) => void
  toggleEraser: () => void
}

export function useCanvasToolbar({
  color,
  isEraser,
  setColor,
  toggleEraser,
}: UseCanvasToolbarArgs) {
  const [showPalette, setShowPalette] = useState(false)
  const [showPicker, setShowPicker] = useState(false)

  const pickerAreaRef = useRef<HTMLDivElement | null>(null)

  const resolved = useMemo(() => resolveCssVar(color), [color])
  const [pickerColor, setPickerColor] = useColor(resolved)

  useEffect(() => {
    const a = (resolved ?? '').toLowerCase()
    const b = (pickerColor.hex ?? '').toLowerCase()
    if (!a || a === b) return

    if (a.startsWith('#')) {
      setPickerColor(ColorService.convert('hex', a))
    }
  }, [resolved, pickerColor.hex, setPickerColor])

  useEffect(() => {
    if (!showPalette) setShowPicker(false)
  }, [showPalette])

  useOnClickOutside(pickerAreaRef, showPicker, () => setShowPicker(false))

  const commit = useCallback(
    (next: IColor) => {
      if (isEraser) toggleEraser()
      setPickerColor(next)
      setColor(next.hex)
    },
    [isEraser, setColor, setPickerColor, toggleEraser]
  )

  const commitHex = useCallback(
    (hex: string) => {
      commit(ColorService.convert('hex', hex))
    },
    [commit]
  )

  const togglePalette = useCallback(() => setShowPalette((p) => !p), [])
  const togglePicker = useCallback(() => setShowPicker((p) => !p), [])
  const closePicker = useCallback(() => setShowPicker(false), [])

  return {
    // state
    showPalette,
    showPicker,
    // refs
    pickerAreaRef,
    // values
    resolved,
    pickerColor,
    currentHex: pickerColor.hex,
    // setters / handlers
    setShowPalette,
    setShowPicker,
    togglePalette,
    togglePicker,
    closePicker,
    commit,
    commitHex,
  }
}
