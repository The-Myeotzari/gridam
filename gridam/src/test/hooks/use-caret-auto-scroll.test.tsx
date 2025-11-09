import { useCaretAutoScroll } from '@/hooks/use-caret-auto-scroll'
import '@testing-library/jest-dom'
import { act, renderHook } from '@testing-library/react'

/**
 * Selection/Range를 간단히 흉내 내는 헬퍼
 * - 캐럿을 contentEditable 밖에 두기 위해 startContainer를 외부 텍스트 노드로 둔다
 * - 이 경우 훅의 getCaretIndex는 contentEditable의 전체 텍스트 길이를 사용
 */
const mockSelectionOutsideCE = () => {
  const externalTextNode = document.createTextNode('outside')
  const fakeRange = {
    startContainer: externalTextNode,
    startOffset: 0,
    cloneRange: () => ({
      selectNodeContents: (_el: Element) => {},
      setEnd: (_node: Node, _offset: number) => {},
      toString: () => '', // 사용되지 않음(CE 밖 시나리오)
    }),
  } as any

  ;(window as any).getSelection = jest.fn(() => ({
    rangeCount: 1,
    getRangeAt: () => fakeRange,
  }))
}

describe('useCaretAutoScroll', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    jest.clearAllMocks()
  })

  it('위로 벗어난 경우: top < scrollTop 이면 scrollTop을 해당 행 top으로 보정', () => {
    // contentEditable 안의 텍스트(전체 길이가 caret index가 됨)
    const ce = document.createElement('div')
    ce.textContent = 'abcdefghij' // 길이 10

    const viewport = document.createElement('div')
    viewport.scrollTop = 100 // 현재 스크롤이 더 아래로 내려와 있음

    // 훅 파라미터
    const cols = 10 // 한 행 칸 수
    const rowHeight = 20 // 한 행 높이
    const visibleRows = 5 // 뷰포트 표시 행 수

    const viewportRef = { current: viewport }
    const ceRef = { current: ce }

    // 캐럿을 CE 밖으로 만들어 전체 길이(10) 사용 → row = floor(10/10) = 1
    // top = 1 * 20 = 20  < scrollTop(100) → scrollTop을 20으로 보정되어야 함
    mockSelectionOutsideCE()

    const { result } = renderHook(() =>
      useCaretAutoScroll(viewportRef as any, ceRef as any, cols, rowHeight, visibleRows)
    )

    act(() => {
      result.current.ensureVisible()
    })

    expect(viewport.scrollTop).toBe(20)
  })

  it('아래로 벗어난 경우: bottom > scrollTop + vpH 이면 아래쪽으로 보정', () => {
    const ce = document.createElement('div')
    // 길이 90 → row = floor(90 / 10) = 9
    ce.textContent = 'x'.repeat(90)

    const viewport = document.createElement('div')
    viewport.scrollTop = 0

    const cols = 10
    const rowHeight = 20
    const visibleRows = 5 // vpH = 100

    // row=9 → top=180, bottom=200
    // bottom(200) > scrollTop(0)+vpH(100) → scrollTop = bottom - vpH + rowHeight = 200 - 100 + 20 = 120
    const viewportRef = { current: viewport }
    const ceRef = { current: ce }

    mockSelectionOutsideCE()

    const { result } = renderHook(() =>
      useCaretAutoScroll(viewportRef as any, ceRef as any, cols, rowHeight, visibleRows)
    )

    act(() => {
      result.current.ensureVisible()
    })

    expect(viewport.scrollTop).toBe(120)
  })

  it('이미 보이는 범위면 scrollTop이 변하지 않는다', () => {
    const ce = document.createElement('div')
    // 길이 30 → row = floor(30/10) = 3 → top=60, bottom=80
    ce.textContent = 'x'.repeat(30)

    const viewport = document.createElement('div')
    const cols = 10
    const rowHeight = 20
    const visibleRows = 5 // vpH = 100

    // 현재 스크롤 50 → 가시 구간 [50, 150]
    // caret 행 [60, 80]은 가시 범위 안 → 변화 없음
    viewport.scrollTop = 50

    const viewportRef = { current: viewport }
    const ceRef = { current: ce }

    mockSelectionOutsideCE()

    const { result } = renderHook(() =>
      useCaretAutoScroll(viewportRef as any, ceRef as any, cols, rowHeight, visibleRows)
    )

    act(() => {
      result.current.ensureVisible()
    })

    expect(viewport.scrollTop).toBe(50)
  })
})
