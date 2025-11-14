'use client'

import { graphemeFromUtf16Index, splitGraphemes } from '../utils/text-utils'

/**
 * useCaretAutoScroll
 * - contentEditable의 캐럿 행이 항상 뷰포트 안에 보이도록 스크롤 보정
 */

// Ref 타입 통합: useRef(MutableRefObject)와 forwardRef(RefObject) 모두 수용
// React 내부 타입 차이로 인한 경고를 피하기 위해 current 필드만 공통 정의로 통합
type DivRef = { current: HTMLDivElement | null }

export function useCaretAutoScroll(
  viewportRef: DivRef, // 스크롤 뷰포트
  contentRef: DivRef, // contentEditable 레이어
  columns: number, // 한 행 칸 수
  rowHeight: number, // 행 높이(px)
  visibleRows: number // 뷰포트 표시 행 수
) {
  // 현재 캐럿 위치를 그래핌 인덱스로 계산
  const getCaretIndex = () => {
    const contentElement = contentRef.current
    const selection = window.getSelection?.()
    if (!contentElement || !selection || selection.rangeCount === 0) return 0

    const range = selection.getRangeAt(0)

    // 캐럿이 contentEditable 밖이면 텍스트 끝으로 간주
    if (!contentElement.contains(range.startContainer)) {
      return splitGraphemes(contentElement.textContent ?? '').length
    }

    // 캐럿 앞부분 텍스트 길이(UTF-16) 계산
    const prefixRange = range.cloneRange()
    prefixRange.selectNodeContents(contentElement)
    prefixRange.setEnd(range.startContainer, range.startOffset)
    const utf16Length = prefixRange.toString().length

    // UTF-16 → 그래핌 인덱스 변환
    return graphemeFromUtf16Index(splitGraphemes(contentElement.textContent ?? ''), utf16Length)
  }

  // 캐럿이 있는 행이 뷰포트 밖이면 scrollTop 보정
  const ensureVisible = () => {
    const viewportElement = viewportRef.current
    if (!viewportElement) return

    const caretIndex = getCaretIndex()
    const caretRow = Math.floor(caretIndex / columns)
    const viewportHeight = visibleRows * rowHeight
    const rowTop = caretRow * rowHeight
    const rowBottom = rowTop + rowHeight

    if (rowTop < viewportElement.scrollTop) {
      viewportElement.scrollTop = rowTop
    } else if (rowBottom > viewportElement.scrollTop + viewportHeight) {
      viewportElement.scrollTop = rowBottom - viewportHeight + rowHeight
    }
  }

  // 외부에 스크롤 보정 함수만 제공
  return { ensureVisible }
}
