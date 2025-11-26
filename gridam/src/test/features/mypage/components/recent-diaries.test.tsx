import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

// Card 컴포넌트 mock
jest.mock('@/shared/ui/card', () => ({
  Card: ({ children, hoverable, ...props }: any) => (
    <div data-testid="card" {...props}>
      {children}
    </div>
  ),
  CardBody: ({ children, ...props }: any) => (
    <div data-testid="card-body" {...props}>
      {children}
    </div>
  ),
  CardHeader: ({
    children,
    cardImage,
    cardTitle,
    cardDescription,
    right,
    iconSize,
    ...props
  }: any) => (
    <div data-testid="card-header" {...props}>
      {cardImage}
      <span>{cardTitle}</span>
      <span>{cardDescription}</span>
      {right}
      {children}
    </div>
  ),
}))

// DropBox mock
jest.mock('@/shared/ui/dropbox', () => (props: any) => (
  <div data-testid="dropbox">dropbox-{props.id}</div>
))

describe.skip('RecentDiaries', () => {
  it('일기가 있을 때 목록을 렌더링한다', () => {
    const RecentDiaries = require('@/features/mypage/components/recent-diaries').default
    const diaries = [
      {
        id: '1',
        date: '2025.11.13',
        weekday: '목요일',
        time: '13:09',
        content: '오늘의 일기',
        emoji: '/emojis/sun.png',
      },
    ]

    render(<RecentDiaries diaries={diaries} />)

    expect(screen.getByText('최근 일기')).toBeInTheDocument()
    expect(screen.getByText('최근에 작성한 일기 목록')).toBeInTheDocument()

    // 일기 내용
    expect(screen.getByText('오늘의 일기')).toBeInTheDocument()
    const img = screen.getByAltText('날씨')
    expect(img).toBeInTheDocument()
    expect(screen.getByText('13:09')).toBeInTheDocument()
    expect(screen.getByText('2025.11.13')).toBeInTheDocument()
    expect(screen.getByText('목요일')).toBeInTheDocument()

    // DropBox가 diary id로 렌더링 되는지
    expect(screen.getByTestId('dropbox')).toHaveTextContent('dropbox-1')
  })

  it('일기가 없을 때 빈 상태 문구를 표시한다', () => {
    const RecentDiaries = require('@/features/mypage/components/recent-diaries').default
    render(<RecentDiaries diaries={[]} />)

    expect(screen.getByText('아직 작성한 일기가 없어요.')).toBeInTheDocument()
  })
})
