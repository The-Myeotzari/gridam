import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import MyStats from '@/features/mypage/components/my-stats'

// Card 컴포넌트 mock
jest.mock('@/components/ui/card', () => ({
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
  CardHeader: ({ children, cardImage, cardDescription, ...props }: any) => (
    <div data-testid="card-header" {...props}>
      {cardImage}
      <span>{cardDescription}</span>
      {children}
    </div>
  ),
}))

describe('MyStats', () => {
  it('작성한 일기와 작성 일수를 표시한다', () => {
    render(<MyStats totalDiaries={5} totalDays={3} />)

    // 라벨
    expect(screen.getByText('작성한 일기')).toBeInTheDocument()
    expect(screen.getByText('작성 일수')).toBeInTheDocument()

    // 값
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('3일')).toBeInTheDocument()

    // 카드 2개 렌더링
    expect(screen.getAllByTestId('card')).toHaveLength(2)
  })
})