import ModalRoot from '@/components/ui/modal/modal-root'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'

// ---------- Mock Store ----------
const mockClose = jest.fn()
let mockNode: React.ReactNode | null = null

jest.mock('@/store/modal-store', () => ({
  useModalStore: () => ({
    node: mockNode,
    close: mockClose,
  }),
}))

// ---------- Mock Modal Component ----------
jest.mock('@/components/ui/modal/modal', () => ({
  Modal: ({ open, onClose, children }: any) => (
    <div data-testid="modal" data-open={open} onClick={onClose}>
      {children}
    </div>
  ),
}))

describe('<ModalRoot />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockNode = null
  })

  it('node가 null이면 아무 것도 렌더링하지 않는다', () => {
    const { container } = render(<ModalRoot />)
    expect(container.firstChild).toBeNull()
  })

  it('node가 존재하면 Modal이 렌더링된다', () => {
    mockNode = <p>테스트 콘텐츠</p>
    render(<ModalRoot />)

    const modal = screen.getByTestId('modal')
    expect(modal).toBeInTheDocument()
    expect(modal).toHaveAttribute('data-open', 'true')
    expect(screen.getByText('테스트 콘텐츠')).toBeInTheDocument()
  })

  it('Modal의 onClose가 호출되면 close 함수가 실행된다', () => {
    mockNode = <p>닫기 테스트</p>
    render(<ModalRoot />)

    const modal = screen.getByTestId('modal')
    modal.click() // 모의 onClose 호출
    expect(mockClose).toHaveBeenCalledTimes(1)
  })
})
