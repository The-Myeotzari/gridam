import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import MyPageHeader from '@/features/mypage/components/mypage-header'

describe('MyPageHeader', () => {
  it('마이페이지 타이틀과 서브타이틀을 렌더링한다', () => {
    render(<MyPageHeader />)

    expect(screen.getByText('마이페이지')).toBeInTheDocument()
    expect(screen.getByText('나의 그림 일기 공간')).toBeInTheDocument()
  })
})