import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import MyPageActions from '@/features/mypage/components/mypage-actions'
import { ButtonProps } from '@/components/ui/button'

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

jest.mock('@/components/ui/button', () => {
  return function ButtonMock(props: ButtonProps) {
    return (
      <button type={props.type} className={props.className}>
        {props.label}
      </button>
    )
  }
})

jest.mock('@/features/mypage/components/change-password-modal', () => {
  return function ChangePasswordModalMock() {
    return <div data-testid="change-password-modal">ChangePasswordModal</div>
  }
})

describe('MyPageActions', () => {
  beforeEach(() => {
    openMock.mockClear()
  })

  it('비밀번호 변경, 로그아웃 버튼을 렌더링한다', () => {
    render(<MyPageActions />)

    expect(screen.getByText('비밀번호 변경')).toBeInTheDocument()
    expect(screen.getByText('로그아웃')).toBeInTheDocument()
  })

  it('비밀번호 변경 버튼 클릭 시 modalStore.open이 호출된다', () => {
    render(<MyPageActions />)

    // span에 onClick이 걸려 있으므로 텍스트 기준으로 클릭
    fireEvent.click(screen.getByText('비밀번호 변경'))

    expect(openMock).toHaveBeenCalledTimes(1)
    // 첫 번째 인자로 close 함수를 인자로 받는 렌더 함수가 넘어오는지 정도만 확인
    const [renderFn] = openMock.mock.calls[0]
    expect(typeof renderFn).toBe('function')
  })
})