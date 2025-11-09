import { Modal } from '@/components/ui/modal/modal'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

beforeAll(() => {
  ;(window as any).scrollTo = jest.fn()
})

// --- Mock: Card & cn ---
jest.mock('@/components/ui/card', () => {
  const React = require('react')
  const Card = React.forwardRef<HTMLDivElement, any>((props, ref) => {
    const { children, className, ...rest } = props
    return (
      <div ref={ref} data-testid="card" className={className} {...rest}>
        {children}
      </div>
    )
  })
  const CardHeader = ({ children }: any) => <div data-testid="card-header">{children}</div>
  const CardBody = ({ children }: any) => <div data-testid="card-body">{children}</div>
  const CardFooter = ({ children }: any) => <div data-testid="card-footer">{children}</div>
  return { Card, CardHeader, CardBody, CardFooter }
})

jest.mock('@/utils/cn', () => ({
  __esModule: true,
  default: (...args: any[]) => args.filter(Boolean).join(' '),
}))

describe('<Modal />', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    jest.clearAllMocks()
  })

  test('open=false면 렌더링하지 않는다', () => {
    const { container } = render(<Modal open={false} onClose={() => {}} />)
    expect(container.firstChild).toBeNull()
  })

  test('open=true면 포털로 렌더링되고 role="dialog"를 가진다', () => {
    render(
      <Modal open onClose={() => {}}>
        <button>ok</button>
      </Modal>
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('ok')).toBeInTheDocument()
  })

  test('size prop에 따라 Card에 사이즈 클래스가 적용된다 (lg)', () => {
    render(
      <Modal open onClose={() => {}} size="lg">
        <div>content</div>
      </Modal>
    )
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('max-w-lg')
  })

  test('추가 className이 cn으로 병합되어 Card에 반영된다', () => {
    render(
      <Modal open onClose={() => {}} className="extra-class">
        <div>content</div>
      </Modal>
    )
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('extra-class')
  })

  test('백드롭 클릭 시 closeOnBackdrop=true이면 onClose가 호출된다', () => {
    const onClose = jest.fn()
    render(
      <Modal open onClose={onClose} closeOnBackdrop>
        <div>content</div>
      </Modal>
    )
    // Tailwind 클래스의 '/'는 selector에서 이스케이프 필요
    const backdrop = document.querySelector('.bg-black\\/80') as HTMLDivElement
    expect(backdrop).toBeInTheDocument()
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('closeOnBackdrop=false이면 백드롭 클릭해도 onClose가 호출되지 않는다', () => {
    const onClose = jest.fn()
    render(
      <Modal open onClose={onClose} closeOnBackdrop={false}>
        <div>content</div>
      </Modal>
    )
    const backdrop = document.querySelector('.bg-black\\/80') as HTMLDivElement
    fireEvent.click(backdrop)
    expect(onClose).not.toHaveBeenCalled()
  })

  test('Escape 키로 닫기: closeOnEscape=true일 때 onClose 호출', () => {
    const onClose = jest.fn()
    render(
      <Modal open onClose={onClose} closeOnEscape>
        <div>content</div>
      </Modal>
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('Escape 키로 닫기: closeOnEscape=false일 때 onClose 호출 안 됨', () => {
    const onClose = jest.fn()
    render(
      <Modal open onClose={onClose} closeOnEscape={false}>
        <div>content</div>
      </Modal>
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
  })

  test('열릴 때 첫 포커스 가능한 요소로 포커스 이동', () => {
    render(
      <Modal open onClose={() => {}}>
        <button>first</button>
        <button>second</button>
      </Modal>
    )
    const first = screen.getByText('first')
    expect(document.activeElement).toBe(first)
  })

  test('포커스 가능한 요소가 없으면 Card에 포커스된다', () => {
    render(
      <Modal open onClose={() => {}}>
        <div>no focusable</div>
      </Modal>
    )
    const card = screen.getByTestId('card')
    expect(document.activeElement).toBe(card)
  })

  test('open=true에서 false로 바뀌면 body 스크롤 락 해제 및 위치 복원', () => {
    const onClose = jest.fn()
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {})
    Object.defineProperty(window, 'scrollY', { value: 180, configurable: true })

    const { rerender } = render(
      <Modal open onClose={onClose}>
        <button>content</button>
      </Modal>
    )

    // 열릴 때 잠김
    expect(document.body.style.position).toBe('fixed')
    expect(document.body.style.top).toBe('-180px')
    expect(document.body.style.width).toBe('100%')

    // 닫힘 → cleanup에서 복원
    rerender(
      <Modal open={false} onClose={onClose}>
        <button>content</button>
      </Modal>
    )
    expect(document.body.style.position).toBe('')
    expect(document.body.style.top).toBe('')
    expect(document.body.style.width).toBe('')
    expect(scrollToSpy).toHaveBeenCalledWith(0, 180)

    scrollToSpy.mockRestore()
  })
})
