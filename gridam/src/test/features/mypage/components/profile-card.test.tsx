import ProfileCard from '@/features/mypage/components/profile-card'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

// Card 컴포넌트 mock
jest.mock('@/shared/ui/card', () => ({
  Card: ({ children, ...props }: any) => (
    <div data-testid="card" {...props}>
      {children}
    </div>
  ),
  CardBody: ({ children, ...props }: any) => (
    <div data-testid="card-body" {...props}>
      {children}
    </div>
  ),
}))

describe('ProfileCard', () => {
  it('이메일, 닉네임, 가입일을 렌더링한다', () => {
    const props = {
      email: 'user@example.com',
      nickname: '홍성준',
      createdAt: '2025-11-13',
    }

    render(<ProfileCard {...props} />)

    // 라벨
    expect(screen.getByText('이메일')).toBeInTheDocument()
    expect(screen.getByText('닉네임')).toBeInTheDocument()
    expect(screen.getByText('가입일')).toBeInTheDocument()

    // 값
    expect(screen.getByText(props.email)).toBeInTheDocument()
    expect(screen.getByText(props.nickname)).toBeInTheDocument()
    expect(screen.getByText(props.createdAt)).toBeInTheDocument()
  })
})
