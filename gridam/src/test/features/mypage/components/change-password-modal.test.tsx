import { changePasswordAction } from '@/features/mypage/api/change-action'
import ChangePasswordModal from '@/features/mypage/components/change-password/change-password-modal'
import { toast } from '@/store/toast-store'
import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

// Button / Input / Label / Modal mock들
jest.mock('@/shared/ui/client-button', () => (props: any) => (
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

// changePasswordAction mock
jest.mock('@/features/mypage/api/change-action', () => ({
  changePasswordAction: jest.fn(),
}))

// toast mock
jest.mock('@/store/toast-store', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

const mockChangePasswordAction = changePasswordAction as jest.MockedFunction<typeof changePasswordAction>
const mockToast = toast as jest.Mocked<typeof toast>

describe('ChangePasswordModal', () => {
  const closeMock = jest.fn()

  beforeEach(() => {
    closeMock.mockClear()
    jest.clearAllMocks()
  })

  it('비밀번호 변경 모달 UI를 렌더링한다', () => {
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
    render(<ChangePasswordModal close={closeMock} />)

    const xIcon = screen.getByTestId('x-icon')
    fireEvent.click(xIcon)

    expect(closeMock).toHaveBeenCalledTimes(1)
  })

  it('폼 제출 시 changePasswordAction이 올바른 값으로 호출되고 성공 시 모달을 닫는다', async () => {
    // changePasswordAction이 성공 응답을 반환하도록 mock
    mockChangePasswordAction.mockResolvedValue({
      ok: true,
      data: {
        message: '비밀번호가 변경되었습니다.'
      },
    })

    render(<ChangePasswordModal close={closeMock} />)

    const currentPasswordInput = screen.getByLabelText('현재 비밀번호')
    const newPasswordInput = screen.getByLabelText('새 비밀번호')
    const confirmPasswordInput = screen.getByLabelText('새 비밀번호 확인')

    fireEvent.change(currentPasswordInput, { target: { value: 'currentPass123' } })
    fireEvent.change(newPasswordInput, { target: { value: 'newPass123!' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'newPass123!' } })

    fireEvent.click(screen.getByText('변경하기'))

    // changePasswordAction 호출 여부 및 인자 검증
    await waitFor(() => {
      expect(mockChangePasswordAction).toHaveBeenCalledTimes(1)
      expect(mockChangePasswordAction).toHaveBeenCalledWith({
        password: 'currentPass123',
        newPassword: 'newPass123!',
        confirmPassword: 'newPass123!',
      })
    })

    // 성공 토스트 + close 호출 검증
    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalled()
      expect(closeMock).toHaveBeenCalledTimes(1)
    })
  })
})