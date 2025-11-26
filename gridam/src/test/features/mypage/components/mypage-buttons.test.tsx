import MyPageButtons from '@/features/mypage/components/mypage-buttons'
import { ButtonProps } from '@/shared/ui/button'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

const pushMock = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

// modalStore mock
const openMock = jest.fn()
jest.mock('@/store/modal-store', () => ({
  modalStore: {
    open: (...args: unknown[]) => openMock(...args),
  },
}))

jest.mock('lucide-react', () => ({
  Key: () => <svg data-testid="key-icon" />,
  LogOut: () => <svg data-testid="logout-icon" />,
}))

jest.mock('@/shared/ui/button', () => {
  return function ButtonMock(props: ButtonProps) {
    return (
      <button type={props.type} className={props.className}>
        {props.label}
      </button>
    )
  }
})

jest.mock('@/features/mypage/components/change-password/change-password-modal', () => {
  return function ChangePasswordModalMock() {
    return <div data-testid="change-password-modal">ChangePasswordModal</div>
  }
})

// 🔹 공용 render 헬퍼
function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient()
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('MyPageButtons', () => {
  beforeEach(() => {
    openMock.mockClear()
    pushMock.mockClear()
  })

  it('비밀번호 변경, 로그아웃 버튼을 렌더링한다', () => {
    renderWithClient(<MyPageButtons />)

    expect(screen.getByText('비밀번호 변경')).toBeInTheDocument()
    expect(screen.getByText('로그아웃')).toBeInTheDocument()
  })

  it('비밀번호 변경 버튼 클릭 시 modalStore.open이 호출된다', () => {
    renderWithClient(<MyPageButtons />)

    fireEvent.click(screen.getByText('비밀번호 변경'))

    expect(openMock).toHaveBeenCalledTimes(1)
    const [renderFn] = openMock.mock.calls[0]
    expect(typeof renderFn).toBe('function')
  })
})
