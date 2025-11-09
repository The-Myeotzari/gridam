import type { RefObject, MutableRefObject } from 'react'
import { graphemeFromUtf16Index, splitGraphemes } from '../utils/text'

/**
 * useCaretAutoScroll
 * - contentEditable의 캐럿 행이 항상 뷰포트 안에 보이도록 스크롤 보정
 */

// Ref 타입 통합: useRef(MutableRefObject)와 forwardRef(RefObject) 모두 수용
type DivRef = RefObject<HTMLDivElement> | MutableRefObject<HTMLDivElement | null>

export function useCaretAutoScroll(
  viewportRef: DivRef, // 스크롤 뷰포트
  ceRef: DivRef, // contentEditable 레이어
  cols: number, // 한 행 칸 수
  rowHeight: number, // 행 높이(px)
  visibleRows: number // 뷰포트 표시 행 수
) {
  // 현재 캐럿 위치를 그래핌 인덱스로 계산

  const getCaretIndex = () => {
    const el = viewportRef && 'current' in ceRef ? ceRef.current : null
    const sel = window.getSelection?.()
    if (!el || !sel || sel.rangeCount === 0) return 0

    const range = sel.getRangeAt(0)

    // 캐럿이 contentEditable 밖이면 텍스트 끝으로 간주
    if (!el.contains(range.startContainer)) {
      return splitGraphemes(el.textContent ?? '').length
    }

    // 캐럿 앞부분 텍스트 길이(UTF-16) 계산
    const pre = range.cloneRange()
    pre.selectNodeContents(el)
    pre.setEnd(range.startContainer, range.startOffset)
    const utf16 = pre.toString().length

    // UTF-16 → 그래핌 인덱스 변환
    return graphemeFromUtf16Index(splitGraphemes(el.textContent ?? ''), utf16)
  }

  // 캐럿이 있는 행이 뷰포트 밖이면 scrollTop 보정
  const ensureVisible = () => {
    const vp = 'current' in viewportRef ? viewportRef.current : null
    if (!vp) return

    const caret = getCaretIndex()
    const row = Math.floor(caret / cols)
    const vpH = visibleRows * rowHeight
    const top = row * rowHeight
    const bottom = top + rowHeight

    if (top < vp.scrollTop) vp.scrollTop = top
    else if (bottom > vp.scrollTop + vpH) vp.scrollTop = bottom - vpH + rowHeight
  }

  // 외부에 스크롤 보정 함수만 제공
  return { ensureVisible }
}
