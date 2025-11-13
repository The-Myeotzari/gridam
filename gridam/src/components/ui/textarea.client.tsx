'use client'

import { useCaretAutoScroll } from '@/hooks/use-caret-auto-scroll'
import { gridStyle, heights } from '@/utils/grid'
import { handleInputOnce, propagateChange } from '@/utils/textarea-actions'
import { buildCells, normalizeValue } from '@/utils/textarea-core'
import { useEffect, useMemo, useRef, useState } from 'react'
/**
 * Props
 * - max/cols/width/cellSize/visibleRows: 격자 규격
 * - value/onChange: 제어형 입력
 * - className/placeholder/readOnly: UI/접근성
 */
export type Props = {
  value?: string
  onChange?: (next: string) => void
  max?: number
  cols?: number
  width?: number
  cellSize?: number
  visibleRows?: number
  className?: string
  placeholder?: string
  readOnly?: boolean
}

export default function Textarea({
  value,
  onChange,
  max = 200, // 최대 그래핌 수
  cols = 10, // 가로 칸 수
  // width = 600, // 전체 폭(px)
  // cellSize, // 칸 크기(px). 미지정 시 width/cols
  visibleRows = 5, // 뷰포트에 보일 행 수
  className,
  placeholder,
  readOnly,
}: Props) {
  // 치수 계산
  // const { cell, gridWidth } = getCellSize(width, cols, cellSize)

  // 상태/참조
  const isControlled = value !== undefined
  const [inner, setInner] = useState(() => normalizeValue(value ?? '', max))
  const ceRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [cell, setCell] = useState(0)
  const gridWidth = cell * cols

  // 부모 width 기반 계산
  useEffect(() => {
    if (!viewportRef.current) return

    const update = () => {
      const parentW = viewportRef.current!.clientWidth ?? 600
      const nextCell = Math.floor(parentW / cols)
      setCell(nextCell)
    }

    update()

    const ro = new ResizeObserver(update)
    ro.observe(viewportRef.current)

    return () => ro.disconnect()
  }, [cols])

  // 커서 기준 자동 스크롤
  const { ensureVisible } = useCaretAutoScroll(viewportRef, ceRef, cols, cell, visibleRows)

  // 뷰 값
  const view = isControlled ? normalizeValue(value as string, max) : inner

  // 외부 value 동기화
  useEffect(() => {
    if (!isControlled) return
    const next = normalizeValue((value as string) ?? '', max)
    const el = ceRef.current
    if (el && el.textContent !== next) el.textContent = next
    requestAnimationFrame(ensureVisible)
  }, [isControlled, value, max, ensureVisible])

  // 입력 처리
  const handleInput = () => {
    const normalizedText = handleInputOnce(ceRef.current, max, normalizeValue)
    propagateChange(normalizedText, isControlled, inner, setInner, onChange)
    requestAnimationFrame(ensureVisible)
  }

  // 렌더 데이터
  const { graphemes, totalRows, cells } = useMemo(
    () => buildCells(view, max, cols),
    [view, max, cols]
  )

  const gridCss = gridStyle(cols, cell)
  const { contentHeight, viewportH } = heights(totalRows, visibleRows, cell)
  const showPh = !view && placeholder

  return (
    <div className={className}>
      {/* 뷰포트(스크롤 영역) */}
      <div
        ref={viewportRef}
        className="relative rounded-xl bg-card border border-border overflow-y-auto overflow-x-hidden no-scrollbar box-border [-webkit-overflow-scrolling:touch]"
        style={{ height: viewportH }}
        onMouseDown={(e) => {
          e.preventDefault()
          if (ceRef.current) ceRef.current.focus()
          requestAnimationFrame(ensureVisible)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.preventDefault() // 개행 금지
          requestAnimationFrame(ensureVisible)
        }}
      >
        {/* 스크롤 컨텐츠 래퍼 */}
        <div className="relative" style={{ height: contentHeight, minWidth: gridWidth }}>
          {/* 격자(시각화) */}
          <div className="grid absolute inset-y-0 left-0 right-0" style={gridCss} aria-hidden>
            {cells.map((ch, i) => (
              <div
                key={i}
                className="flex items-center justify-center border border-border/60 bg-background text-base leading-none select-none"
                style={{ width: cell, height: cell }}
              >
                <span className="pointer-events-none">{ch}</span>
              </div>
            ))}
          </div>

          {/* 입력 레이어(contentEditable, 투명) */}
          <div
            ref={ceRef}
            role="textbox"
            aria-label="원고지 입력"
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onInput={handleInput}
            className="absolute inset-y-0 left-0 right-0 z-10 outline-none bg-transparent text-transparent caret-transparent whitespace-pre overflow-hidden"
            tabIndex={0}
            style={{ width: gridWidth }}
          />
        </div>

        {/* placeholder */}
        {showPh && (
          <div className="absolute left-2 top-2 text-sm text-muted-foreground pointer-events-none select-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* 카운터 */}
      <div className="mt-2 text-xs text-muted-foreground">
        {graphemes.length} / {max}
      </div>
    </div>
  )
}
