import { useChangePassword } from '@/features/mypage/api/queries/use-change-password'
import ChangePasswordModal from '@/features/mypage/components/change-password/change-password-modal'
import { toast } from '@/store/toast-store'
import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

// Button / Input / Label / Modal mock들
jest.mock('@/shared/ui/button', () => (props: any) => (
  <button type={props.type} className={props.className} onClick={props.onClick}>
    {props.label}
  </button>
))

jest.mock('@/shared/ui/input', () => (props: any) => <input {...props} />)

jest.mock('@/shared/ui/label', () => (props: any) => <label {...props}>{props.children}</label>)

jest.mock('@/shared/ui/modal/modal', () => ({
  ModalHeader: (props: any) => (
    <header>
      {props.cardTitle}
      {props.cardDescription}
      {props.right}
    </header>
  ),
  ModalBody: (props: any) => <div>{props.children}</div>,
}))

// lucide-react X 아이콘 mock
jest.mock('lucide-react', () => ({
  X: (props: any) => <svg data-testid="x-icon" {...props} />,
}))

// useChangePassword 훅 mock
jest.mock('@/features/mypage/api/queries/use-change-password')

// toast mock
jest.mock('@/store/toast-store', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

const mockUseChangePassword = useChangePassword as jest.Mock
const mockToast = toast as jest.Mocked<typeof toast>

describe('ChangePasswordModal', () => {
  const closeMock = jest.fn()

  beforeEach(() => {
    closeMock.mockClear()
    jest.clearAllMocks()
  })

  it('비밀번호 변경 모달 UI를 렌더링한다', () => {
    // useChangePassword 기본 mock (필수)
    mockUseChangePassword.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    })

    render(<ChangePasswordModal close={closeMock} />)

    expect(screen.getByText('비밀번호 변경')).toBeInTheDocument()
    expect(screen.getByText('새로운 비밀번호를 입력해주세요')).toBeInTheDocument()

    // 레이블
    expect(screen.getByText('현재 비밀번호')).toBeInTheDocument()
    expect(screen.getByText('새 비밀번호')).toBeInTheDocument()
    expect(screen.getByText('새 비밀번호 확인')).toBeInTheDocument()

    // 버튼
    expect(screen.getByText('변경하기')).toBeInTheDocument()
  })

  it('X 아이콘 클릭 시 close가 호출된다', () => {
    mockUseChangePassword.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    })

    render(<ChangePasswordModal close={closeMock} />)

    const xIcon = screen.getByTestId('x-icon')
    fireEvent.click(xIcon)

    expect(closeMock).toHaveBeenCalledTimes(1)
  })

  it('폼 제출 시 useChangePassword.mutateAsync가 올바른 값으로 호출되고 성공 시 모달을 닫는다', async () => {
    const mutateAsync = jest.fn().mockResolvedValue({
      ok: true,
      message: '비밀번호가 변경되었습니다.',
    })

    mockUseChangePassword.mockReturnValue({
      mutateAsync,
      isPending: false,
    })

    render(<ChangePasswordModal close={closeMock} />)

    const currentPasswordInput = screen.getByLabelText('현재 비밀번호')
    const newPasswordInput = screen.getByLabelText('새 비밀번호')
    const confirmPasswordInput = screen.getByLabelText('새 비밀번호 확인')

    fireEvent.change(currentPasswordInput, { target: { value: 'currentPass123' } })
    fireEvent.change(newPasswordInput, { target: { value: 'newPass123!' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'newPass123!' } })

    fireEvent.click(screen.getByText('변경하기'))

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledTimes(1)
      expect(mutateAsync).toHaveBeenCalledWith({
        password: 'currentPass123',
        newPassword: 'newPass123!',
        confirmPassword: 'newPass123!',
      })
    })

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalled()
      expect(closeMock).toHaveBeenCalledTimes(1)
    })
  })
})
