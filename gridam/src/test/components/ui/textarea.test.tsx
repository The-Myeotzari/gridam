import Textarea from '@/components/ui/textarea'
import * as TU from '@/utils/text-utils'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

// rAF를 사용하는 컴포넌트이므로 JSDOM 환경에서 폴리필
beforeAll(() => {
  // @ts-ignore
  global.requestAnimationFrame =
    // @ts-ignore
    global.requestAnimationFrame ||
    ((cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 0))
  // @ts-ignore
  global.cancelAnimationFrame =
    // @ts-ignore
    global.cancelAnimationFrame || ((id: number) => clearTimeout(id))
})

// caret 자동 스크롤 훅: ensureVisible만 가진 더미 반환
jest.mock('@/hooks/use-caret-auto-scroll', () => ({
  useCaretAutoScroll: () => ({ ensureVisible: () => {} }),
}))

// 텍스트 유틸은 테스트에서 예측 가능하도록 간단 모킹
jest.mock('@/utils/text-utils', () => {
  const sanitize = (s: string) => s.replace(/[\r\n\t]+/g, ' ')
  const splitGraphemes = (input: string) => Array.from(input).filter((ch) => ch !== ' ')
  const clamp = (text: string, max: number) => {
    const g = splitGraphemes(text)
    return g.length <= max ? text : g.slice(0, max).join('')
  }
  return {
    sanitize,
    splitGraphemes,
    clamp,
  }
})

/**
 * contentEditable input 유틸:
 * - textContent 설정 후 input 이벤트를 발생시켜 컴포넌트 로직을 태움
 */
function typeIntoCE(text: string) {
  const ce = screen.getByRole('textbox', { name: '원고지 입력' })
  ;(ce as HTMLElement).textContent = text
  fireEvent.input(ce)
}

describe('<Textarea />', () => {
  test('그리드 셀 수가 max/cols에 따라 계산된다', () => {
    // max=6, cols=3 => totalRows=ceil(6/3)=2, totalCells=6
    const { container } = render(
      <Textarea max={6} cols={3} width={300} cellSize={50} visibleRows={2} />
    )
    // aria-hidden grid 컨테이너를 찾아 자식 div 수 체크
    const grid = container.querySelector('div[aria-hidden="true"]')
    expect(grid).toBeInTheDocument()
    // 각 셀은 map()으로 생성된 자식 div
    const cells = grid!.querySelectorAll(':scope > div')
    expect(cells.length).toBe(6)
  })

  test('placeholder는 빈 값에서 보이고, 입력 시 숨겨진다', () => {
    render(<Textarea placeholder="힌트" max={10} cols={5} width={250} cellSize={50} />)
    // 초기 표시
    expect(screen.getByText('힌트')).toBeInTheDocument()

    // 입력 → placeholder 사라짐
    typeIntoCE('abc')
    expect(screen.queryByText('힌트')).not.toBeInTheDocument()
  })

  test('비제어형: 입력 시 sanitize + clamp 적용, onChange 호출', async () => {
    const onChange = jest.fn()
    const max = 5
    render(<Textarea onChange={onChange} max={max} cols={5} width={250} cellSize={50} />)

    const raw = 'a\tb\nc\rd'
    const sanitized = TU.sanitize(raw)
    const clamped = TU.clamp(sanitized, max)

    // 입력 트리거 (contentEditable)
    typeIntoCE(raw)
    // onChange는 sanitize → clamp 결과로 호출
    expect(onChange).toHaveBeenLastCalledWith(clamped)

    // 카운터는 비동기 렌더 후 갱신 → 공백 제외 그래핌 수를 기대값으로 계산
    const expectedCount = TU.splitGraphemes(clamped).length // 'a b c d' => 4
    await screen.findByText(`${expectedCount} / ${max}`) // "4 / 5"
  })

  test('제어형: value를 넘기면 view는 value를 따른다 (onChange는 호출됨)', () => {
    const onChange = jest.fn()
    const { rerender } = render(
      <Textarea value="hi" onChange={onChange} max={5} cols={5} width={250} cellSize={50} />
    )

    // 입력을 시도해도 view는 여전히 외부 value('hi') 기준
    typeIntoCE('hello!!') // clamp(5) → 'hello'
    expect(onChange).toHaveBeenLastCalledWith('hello')

    // 카운터는 'hi' 길이 2 / 5
    expect(screen.getByText(/\/ 5$/).textContent).toBe('2 / 5')

    // 부모가 value를 업데이트했다고 가정하고 rerender
    rerender(
      <Textarea value="hello" onChange={onChange} max={5} cols={5} width={250} cellSize={50} />
    )
    expect(screen.getByText(/\/ 5$/).textContent).toBe('5 / 5')
  })

  test('readOnly=true면 contentEditable=false', () => {
    render(<Textarea readOnly />)
    const ce = screen.getByRole('textbox', { name: '원고지 입력' })
    // contentEditable 속성은 문자열로 반영됨: "false"
    expect(ce).toHaveAttribute('contenteditable', 'false')
  })

  test('className/width/viewport 높이 스타일이 적용된다', () => {
    const { container } = render(
      <Textarea className="extra-wrap" width={320} cols={4} visibleRows={3} cellSize={20} />
    )
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveClass('extra-wrap')
    expect(root).toHaveStyle({ width: '320px' })

    // 뷰포트는 높이 = visibleRows * cellSize = 3 * 20 = 60
    const viewport = root.querySelector(
      '.relative.rounded-xl.bg-card.border.border-border.overflow-y-auto'
    ) as HTMLElement
    expect(viewport).toBeInTheDocument()
    expect(viewport.style.height).toBe('60px')
  })

  test('카운터는 현재 그래핌 수를 표시한다', () => {
    render(<Textarea max={8} cols={4} width={200} cellSize={25} />)
    expect(screen.getByText(/\/ 8$/).textContent).toBe('0 / 8')
    typeIntoCE('abcd')
    expect(screen.getByText(/\/ 8$/).textContent).toBe('4 / 8')
  })
})
