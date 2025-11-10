import Toast from '@/components/ui/toast'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

jest.mock('@/store/toast-store', () => ({
  useToast: jest.fn(),
}))

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardBody: ({ children, className }: any) => (
    <div data-testid="card-body" className={className}>
      {children}
    </div>
  ),
}))

jest.mock('lucide-react', () => ({
  CheckCircle2Icon: (props: any) => <svg data-testid="success-icon" {...props}></svg>,
  AlertCircleIcon: (props: any) => <svg data-testid="alert-icon" {...props}></svg>,
}))

describe('<Toast />', () => {
  const mockUseToast = require('@/store/toast-store').useToast as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('토스트가 없으면 빈 컨테이너만 렌더링된다', () => {
    mockUseToast.mockReturnValue({ items: [] })
    const { container } = render(<Toast />)
    expect(container.firstChild).toHaveClass('fixed', 'bottom-6', 'right-1')
    expect(screen.queryAllByTestId('card')).toHaveLength(0)
  })

  test('success 타입 토스트 렌더링', () => {
    mockUseToast.mockReturnValue({
      items: [{ id: '1', type: 'success', message: '성공했습니다!' }],
    })

    render(<Toast />)

    // 카드와 메시지 확인
    const cards = screen.getAllByTestId('card')
    expect(cards).toHaveLength(1)
    expect(screen.getByText('성공했습니다!')).toBeInTheDocument()

    // success 아이콘 렌더링
    expect(screen.getByTestId('success-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('alert-icon')).not.toBeInTheDocument()

    // 카드 스타일
    expect(cards[0]).toHaveClass('bg-cream-white')
  })

  test('error(또는 success 외) 타입 토스트 렌더링', () => {
    mockUseToast.mockReturnValue({
      items: [{ id: '2', type: 'error', message: '문제가 발생했습니다.' }],
    })

    render(<Toast />)

    // alert 아이콘 렌더링
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('success-icon')).not.toBeInTheDocument()

    // 메시지 확인
    expect(screen.getByText('문제가 발생했습니다.')).toBeInTheDocument()
  })

  test('여러 개의 토스트가 동시에 렌더링된다', () => {
    mockUseToast.mockReturnValue({
      items: [
        { id: 'a', type: 'success', message: '성공 메시지' },
        { id: 'b', type: 'error', message: '에러 메시지' },
      ],
    })

    render(<Toast />)
    expect(screen.getAllByTestId('card')).toHaveLength(2)
    expect(screen.getByText('성공 메시지')).toBeInTheDocument()
    expect(screen.getByText('에러 메시지')).toBeInTheDocument()
  })
})
