import HeaderNavLink from '@/components/common/header-navlink'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

// next/link를 단순화(mock)
jest.mock('next/link', () => {
  return ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  )
})

describe('HeaderNavLink (path prop 버전)', () => {
  it('path와 href가 같을 때 active 스타일이 적용된다', () => {
    render(<HeaderNavLink href="/feed" label="피드" activeColor="primary" path="/feed" />)

    const link = screen.getByRole('link', { name: '피드' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveClass('bg-primary', 'text-primary-foreground')
  })

  it('path와 href가 다를 때 hover 스타일이 적용된다', () => {
    render(<HeaderNavLink href="/feed" label="피드" activeColor="primary" path="/" />)

    const link = screen.getByRole('link', { name: '피드' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveClass('hover:bg-primary', 'text-foreground')
  })

  it('activeColor가 accent일 때 색상 클래스가 올바르다', () => {
    render(<HeaderNavLink href="/mypage" label="마이페이지" activeColor="accent" path="/mypage" />)

    const link = screen.getByRole('link', { name: '마이페이지' })
    expect(link).toHaveAttribute('href', '/mypage')
    expect(link).toHaveClass('bg-accent', 'text-accent-foreground')
  })
})
