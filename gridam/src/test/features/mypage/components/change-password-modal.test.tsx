import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ChangePasswordModal from '@/features/mypage/components/change-password-modal'

// Button / Input / Label / Modal mock들
jest.mock('@/components/ui/button', () => (props: any) => (
  <button
    type={props.type}
    className={props.className}
    onClick={props.onClick}
  >
    {props.label}
  </button>
))

jest.mock('@/components/ui/input', () => (props: any) => (
  <input {...props} />
))

jest.mock('@/components/ui/label', () => (props: any) => (
  <label {...props}>{props.children}</label>
))

jest.mock('@/components/ui/modal/modal', () => ({
  ModalHeader: (props: any) => (
    <header>
      {props.cardTitle}
      {props.cardDescription}
      {props.right}
    </header>
  ),
  ModalBody: (props: any) => <div>{props.children}</div>,
}))

// lucide-react X 아이콘 mock (테스트에선 역할만 필요)
jest.mock('lucide-react', () => ({
  X: (props: any) => <svg data-testid="x-icon" {...props} />,
}))

describe('ChangePasswordModal', () => {
  const closeMock = jest.fn()
  const originalConsoleLog = console.log

  beforeEach(() => {
    closeMock.mockClear()
    console.log = jest.fn()
  })

  afterEach(() => {
    console.log = originalConsoleLog
  })

  it('비밀번호 변경 모달 UI를 렌더링한다', () => {
    render(<ChangePasswordModal close={closeMock} />)

    expect(screen.getByText('비밀번호 변경')).toBeInTheDocument()
    expect(
      screen.getByText('새로운 비밀번호를 입력해주세요')
    ).toBeInTheDocument()

    // 레이블
    expect(screen.getByText('현재 비밀번호')).toBeInTheDocument()
    expect(screen.getByText('새 비밀번호')).toBeInTheDocument()
    expect(screen.getByText('새 비밀번호 확인')).toBeInTheDocument()

    // 버튼
    expect(screen.getByText('변경하기')).toBeInTheDocument()
  })

  it('X 아이콘 클릭 시 close가 호출된다', () => {
    render(<ChangePasswordModal close={closeMock} />)

    const xIcon = screen.getByTestId('x-icon')
    fireEvent.click(xIcon)

    expect(closeMock).toHaveBeenCalledTimes(1)
  })

  it('폼 제출 시 입력값이 console.log로 전달된다', async () => {
  render(<ChangePasswordModal close={closeMock} />)

  const currentPasswordInput = screen.getByLabelText('현재 비밀번호')
  const newPasswordInput     = screen.getByLabelText('새 비밀번호')
  const confirmPasswordInput = screen.getByLabelText('새 비밀번호 확인')

  fireEvent.change(currentPasswordInput, { target: { value: 'currentPass123' } })
  fireEvent.change(newPasswordInput,     { target: { value: 'newPass123!' } })
  fireEvent.change(confirmPasswordInput, { target: { value: 'newPass123!' } })

  fireEvent.click(screen.getByText('변경하기'))

  await waitFor(() => {
    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledWith({
      password: 'currentPass123',
      newPassword: 'newPass123!',
      confirmPassword: 'newPass123!',
    })
  })
})
})