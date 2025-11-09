'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { clamp, sanitize, splitGraphemes } from '@/utils/text'
import { useCaretAutoScroll } from '@/hooks/useCaretAutoScroll'

/**
 * Props
 * - max/cols/width/cellSize/visibleRows: 격자 규격
 * - value/onChange: 제어형 입력
 * - className/placeholder/readOnly: UI/접근성
 */
type Props = {
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
  width = 600, // 전체 폭(px)
  cellSize, // 칸 크기(px). 미지정 시 width/cols
  visibleRows = 5, // 뷰포트에 보일 행 수
  className,
  placeholder,
  readOnly,
}: Props) {
  // 치수 계산
  const cell = cellSize ?? Math.floor(width / cols)
  const gridWidth = cell * cols

  // 상태/참조
  const [inner, setInner] = useState(clamp(value ?? '', max))
  const ceRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  // 커서 기준 자동 스크롤
  const { ensureVisible } = useCaretAutoScroll(viewportRef, ceRef, cols, cell, visibleRows)

  // *** 추가: 제어형 여부 및 뷰 값 ***
  const isControlled = value !== undefined
  const view = isControlled ? clamp(value as string, max) : inner

  // 외부 value 동기화
  useEffect(() => {
    if (!isControlled) return
    const next = clamp((value as string) ?? '', max)
    if (ceRef.current && ceRef.current.textContent !== next) ceRef.current.textContent = next
    requestAnimationFrame(ensureVisible)
  }, [isControlled, value, max, ensureVisible])

  // 내부값 설정: sanitize → clamp → 상태/콜백
  const setValue = (next: string) => {
    const c = clamp(sanitize(next), max)
    setInner(c)
    onChange?.(c)
  }

  // 입력 처리: 정제/교정/반영/오토스크롤
  const handleInput = () => {
    const el = ceRef.current
    if (!el) return
    const raw = el.textContent ?? ''
    const c = clamp(sanitize(raw), max)
    if (raw !== c) el.textContent = c
    if (isControlled) {
      onChange?.(c)
    } else {
      if (c !== inner) setValue(c)
    }
    requestAnimationFrame(ensureVisible)
  }

  // 렌더 데이터: 그래핌 분해/셀 배열
  const graphemes = useMemo(() => splitGraphemes(view), [view])
  const totalRows = Math.ceil(max / cols)
  const totalCells = totalRows * cols
  const cells = useMemo(() => {
    const filled = graphemes.slice(0, totalCells)
    const blanks = Math.max(0, totalCells - filled.length)
    return [...filled, ...Array.from({ length: blanks }, () => '')]
  }, [graphemes, totalCells])

  // Grid 스타일
  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
    gridAutoRows: `${cell}px`,
  }

  // 높이 계산
  const contentHeight = totalRows * cell
  const viewportH = visibleRows * cell

  // placeholder 표시 여부
  const showPh = !view && placeholder

  return (
    <div className={className} style={{ width }}>
      {/* 뷰포트(스크롤 영역) */}
      <div
        ref={viewportRef}
        className="relative rounded-xl bg-card border border-border overflow-y-auto overflow-x-hidden no-scrollbar box-border [-webkit-overflow-scrolling:touch]"
        style={{ width, height: viewportH }}
        onMouseDown={(e) => {
          e.preventDefault()
          ceRef.current?.focus()
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
          <div className="grid absolute inset-y-0 left-0 right-0" style={gridStyle} aria-hidden>
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
